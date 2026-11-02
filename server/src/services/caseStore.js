import { Case } from '../models/Case.js';
import { InvestigationData, Submission } from '../models/InvestigationData.js';
export const memory = { cases: new Map(), data: new Map(), submissions: new Map() };
export const databaseReady = () => Boolean(globalThis.mongoReady);
export async function saveCase(data) { if (databaseReady()) { const record = new Case(data); await record.save(); return record; } memory.cases.set(data.caseId, structuredClone(data)); return data; }
export async function findCase(id, includeSolution = false) {
  if (!databaseReady()) return memory.cases.get(id) || null;
  const query = Case.findOne({ caseId: id }); if (includeSolution) query.select('+culpritId +motive +explanation +decisiveClues'); return query.lean();
}
export async function updateCase(id, update) {
  if (!databaseReady()) { const value = memory.cases.get(id); if (!value) return null; Object.assign(value, update); return value; }
  return Case.findOneAndUpdate({ caseId: id }, update, { new: true }).select('+culpritId +motive +explanation +decisiveClues').lean();
}
export async function claimCase(id, update) {
  if (!databaseReady()) { const value = memory.cases.get(id); if (!value || value.status !== 'active') return null; Object.assign(value, update); return value; }
  return Case.findOneAndUpdate({ caseId: id, status: 'active' }, { $set: update }, { new: true }).select('+culpritId +motive +explanation +decisiveClues').lean();
}
const dataKey = (caseId, sessionId) => `${caseId}:${sessionId}`;
export async function findInvestigationData(caseId, sessionId) { return databaseReady() ? InvestigationData.findOne({ caseId, sessionId }).lean() : memory.data.get(dataKey(caseId, sessionId)) || null; }
export async function saveInvestigationData(caseId, sessionId, update) {
  if (databaseReady()) return InvestigationData.findOneAndUpdate({ caseId, sessionId }, { $set: update, $setOnInsert: { caseId, sessionId } }, { upsert: true, new: true, runValidators: true }).lean();
  const key = dataKey(caseId, sessionId); const old = memory.data.get(key) || { caseId, sessionId, notes: '', bookmarks: [] }; const next = { ...old, ...update }; memory.data.set(key, next); return next;
}
export async function createSubmission(data) { if (databaseReady()) return new Submission(data).save(); memory.submissions.set(data.resultId, data); return data; }
export async function findSubmission(resultId, caseId, sessionId) {
  if (databaseReady()) { const query = { resultId, caseId }; if (sessionId) query.sessionId = sessionId; return Submission.findOne(query).lean(); }
  const result = memory.submissions.get(resultId); return result && result.caseId === caseId && (!sessionId || result.sessionId === sessionId) ? result : null;
}
