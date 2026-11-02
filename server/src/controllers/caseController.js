import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { generateMystery } from '../services/mysteryService.js';
import { claimCase, createSubmission, findCase, findInvestigationData, findSubmission, saveCase, saveInvestigationData } from '../services/caseStore.js';

const generationSchema = z.object({
  scenario: z.string().trim().min(30).max(2000), category: z.string().trim().min(1).max(60),
  difficulty: z.enum(['easy', 'medium', 'hard']), suspectCount: z.coerce.number().int().min(3).max(6),
  setting: z.string().trim().max(120).default('AI decides based on the story'),
  sessionId: z.string().uuid(),
});
const session = (req) => req.get('x-session-id') || req.body?.sessionId;
const publicCase = (record, data) => ({
  caseId: record.caseId, caseNumber: record.caseNumber, title: record.title, category: record.category,
  difficulty: record.difficulty, introduction: record.introduction, description: record.description,
  location: record.location, dateTime: record.dateTime, suspects: record.suspects,
  timeline: record.timeline, evidence: record.evidence, status: record.status,
  generationMode: record.generationMode, notes: data?.notes || '', bookmarks: data?.bookmarks || [],
});
export async function generate(req, res, next) {
  try {
    const input = generationSchema.parse(req.body);
    const generated = await generateMystery(input);
    if (!generated.suspects.some((suspect) => suspect.suspectId === generated.culpritId)) return res.status(502).json({ success: false, message: 'The generated case did not contain a valid solution. Please try again.' });
    const record = await saveCase({ ...generated, caseId: generated.caseId || randomUUID(), status: 'active' });
    await saveInvestigationData(record.caseId, input.sessionId, { notes: '', bookmarks: [] });
    res.status(201).json({ success: true, data: publicCase(record) });
  } catch (error) { next(error); }
}
export async function getById(req, res, next) {
  try {
    const record = await findCase(req.params.caseId);
    if (!record) return res.status(404).json({ success: false, message: 'Case not found.' });
    if (record.status === 'completed' || record.status === 'submitted') return res.status(409).json({ success: false, message: 'This investigation has already been submitted.' });
    const data = await findInvestigationData(record.caseId, session(req));
    res.json({ success: true, data: publicCase(record, data) });
  } catch (error) { next(error); }
}
export async function getEvidence(req, res, next) {
  try {
    const record = await findCase(req.params.caseId);
    if (!record) return res.status(404).json({ success: false, message: 'Case not found.' });
    if (record.status !== 'active') return res.status(409).json({ success: false, message: 'This investigation has already been submitted.' });
    res.json({ success: true, data: record.evidence });
  } catch (error) { next(error); }
}
export async function getEvidenceById(req, res, next) {
  try {
    const record = await findCase(req.params.caseId);
    if (!record) return res.status(404).json({ success: false, message: 'Case not found.' });
    if (record.status !== 'active') return res.status(409).json({ success: false, message: 'This investigation has already been submitted.' });
    const item = record.evidence.find((e) => e.evidenceId === req.params.evidenceId);
    if (!item) return res.status(404).json({ success: false, message: 'Evidence not found.' });
    res.json({ success: true, data: item });
  } catch (error) { next(error); }
}
export async function submit(req, res, next) {
  try {
    const body = z.object({ suspectId: z.string().min(1).max(100) }).parse(req.body);
    const sessionId = session(req); if (!sessionId || !z.string().uuid().safeParse(sessionId).success) return res.status(400).json({ success: false, message: 'A valid investigation session is required.' });
    const record = await findCase(req.params.caseId, true);
    if (!record) return res.status(404).json({ success: false, message: 'Case not found.' });
    if (record.status !== 'active') return res.status(409).json({ success: false, message: 'An answer has already been submitted for this investigation.' });
    if (!record.suspects.some((s) => s.suspectId === body.suspectId)) return res.status(400).json({ success: false, message: 'Choose a suspect from this case.' });
    const resultId = randomUUID(); const correct = body.suspectId === record.culpritId;
    const data = { resultId, caseId: record.caseId, sessionId, suspectId: body.suspectId, correct, submittedAt: new Date() };
    const claimed = await claimCase(record.caseId, { status: 'completed', submittedSuspectId: body.suspectId, submittedAt: data.submittedAt, resultId });
    if (!claimed) return res.status(409).json({ success: false, message: 'An answer has already been submitted for this investigation.' });
    await createSubmission(data);
    res.json({ success: true, data: { resultId } });
  } catch (error) { next(error); }
}
export async function getResult(req, res, next) {
  try {
    const sessionId = session(req); if (!sessionId) return res.status(400).json({ success: false, message: 'A valid investigation session is required.' });
    const record = await findCase(req.params.caseId, true);
    const submission = await findSubmission(req.params.resultId, req.params.caseId, sessionId);
    if (!record || !submission) return res.status(404).json({ success: false, message: 'Case result not found.' });
    const culprit = record.suspects.find((s) => s.suspectId === record.culpritId);
    res.json({ success: true, data: { caseId: record.caseId, caseNumber: record.caseNumber, title: record.title, correct: submission.correct, culprit: { name: culprit.name, occupation: culprit.occupation, suspectId: culprit.suspectId }, selectedSuspectId: submission.suspectId, motive: record.motive, explanation: record.explanation, decisiveClues: record.decisiveClues } });
  } catch (error) { next(error); }
}
export async function getNotes(req, res, next) {
  try { const sid = session(req); if (!sid) return res.status(400).json({ success: false, message: 'A valid investigation session is required.' }); const data = await findInvestigationData(req.params.caseId, sid); res.json({ success: true, data: { notes: data?.notes || '', bookmarks: data?.bookmarks || [] } }); } catch (error) { next(error); }
}
export async function putNotes(req, res, next) {
  try { const sid = session(req); if (!sid || !z.string().uuid().safeParse(sid).success) return res.status(400).json({ success: false, message: 'A valid investigation session is required.' }); const { notes } = z.object({ notes: z.string().max(10000) }).parse(req.body); const record = await findCase(req.params.caseId); if (!record) return res.status(404).json({ success: false, message: 'Case not found.' }); const data = await saveInvestigationData(record.caseId, sid, { notes }); res.json({ success: true, data: { notes: data.notes } }); } catch (error) { next(error); }
}
export async function bookmark(req, res, next) {
  try { const sid = session(req); if (!sid || !z.string().uuid().safeParse(sid).success) return res.status(400).json({ success: false, message: 'A valid investigation session is required.' }); const record = await findCase(req.params.caseId); if (!record) return res.status(404).json({ success: false, message: 'Case not found.' }); if (!record.evidence.some((e) => e.evidenceId === req.params.evidenceId)) return res.status(404).json({ success: false, message: 'Evidence not found.' }); const old = await findInvestigationData(record.caseId, sid); const set = new Set(old?.bookmarks || []); if (req.method === 'POST') set.add(req.params.evidenceId); else set.delete(req.params.evidenceId); const data = await saveInvestigationData(record.caseId, sid, { bookmarks: [...set] }); res.json({ success: true, data: { bookmarks: data.bookmarks } }); } catch (error) { next(error); }
}
