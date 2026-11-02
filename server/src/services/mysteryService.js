import { GoogleGenAI } from '@google/genai';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { env } from '../config/env.js';
import { mysteryPrompt } from '../prompts/generateMystery.js';

const schema = z.object({
  caseNumber: z.string().optional(), title: z.string().min(3), introduction: z.string(), description: z.string(),
  location: z.string(), dateTime: z.string(), category: z.string(), difficulty: z.string(),
  suspects: z.array(z.object({ suspectId: z.string(), name: z.string(), age: z.number().optional(), occupation: z.string(), relationship: z.string(), description: z.string(), alibi: z.string() })).min(3).max(6),
  culpritId: z.string(), motive: z.string(), explanation: z.string(), decisiveClues: z.array(z.string()).min(1),
  timeline: z.array(z.object({ time: z.string(), event: z.string(), detail: z.string() })).min(3),
  evidence: z.array(z.object({ evidenceId: z.string(), type: z.enum(['message', 'photo', 'cctv', 'witness', 'document']), title: z.string(), description: z.string(), timestamp: z.string().optional(), messages: z.array(z.object({ sender: z.string(), time: z.string(), content: z.string() })).optional(), imagePrompt: z.string().optional(), imageUrl: z.string().optional(), statement: z.string().optional(), witnessName: z.string().optional(), cameraId: z.string().optional(), content: z.string().optional(), clues: z.array(z.string()).optional() })).min(5),
});
const demoCase = (input) => {
  const suspects = [
    ['Mara Voss', 'Night curator', 'The person who catalogued the archive', 'She says she was locking the east wing at 21:15.'],
    ['Elliot Crane', 'Restoration specialist', 'A visiting expert with access to the collection', 'He says he left the building before closing.'],
    ['June Bell', 'Reading-room attendant', 'A regular presence in the west gallery', 'She says she was on the front desk all evening.'],
    ['Theo Pike', 'Building caretaker', 'Responsible for keys and the old service lift', 'He says the lift was out of order that night.'],
    ['Nadia Wells', 'Local historian', 'Researcher with a long-standing interest in the missing item', 'She says she was at home by 20:30.'],
    ['Owen Hart', 'Security officer', 'Assigned to the overnight watch', 'He says he made an uninterrupted patrol.'],
  ].slice(0, input.suspectCount).map((x, i) => ({ suspectId: `suspect-${i + 1}`, name: x[0], age: 32 + i * 4, occupation: x[1], relationship: x[2], description: `${x[0]} has worked around the archive long enough to know which doors stick and which cameras miss a corner. Their connection to the case deserves a closer look.`, alibi: x[3] }));
  const ids = suspects.map((s) => s.suspectId);
  return {
    caseNumber: '001', title: 'The Borrowed Hour', introduction: 'At first light, the archive’s locked west room stood open. A one-of-a-kind folio had vanished without a broken lock or a sound on the night watch.', description: input.scenario,
    location: input.setting || 'The Ashcombe Archive', dateTime: 'Thursday, 14 October · 21:00–23:00', category: input.category, difficulty: input.difficulty,
    suspects, culpritId: ids[0], motive: 'Mara had quietly promised the rare folio to a private collector to cover a debt. She needed the theft to appear to happen during the overnight watch, when no one would be able to account for the service corridor.',
    explanation: 'Mara used the curator’s duplicate key to enter the west room before the building closed, then placed the folio inside the hollow base of a display case being moved for restoration. The case was wheeled into the service corridor while the hall camera looped an earlier empty view. Her note about locking the east wing placed her near the corridor at the precise time she claimed to be elsewhere. The caretaker’s out-of-order lift report was true, but it made the service stair an unmonitored route and distracted investigators from the wheeled display case.',
    decisiveClues: ['The west hall camera repeats the same empty frame at 21:42 and 22:07.', 'A handling log places Mara beside the display case shortly before the supposed theft window.', 'The duplicate key was signed back in after the room was reported locked.'],
    timeline: [
      { time: '20:45', event: 'Archive closes to visitors', detail: 'The last visitor signs out. All five suspects remain connected to the building or collection.' },
      { time: '21:15', event: 'East wing reportedly secured', detail: 'Mara records the wing as locked; the key ledger shows a later return.' },
      { time: '21:42', event: 'West hall camera repeats a frame', detail: 'The recording shows an identical empty corridor view to the one logged at 22:07.' },
      { time: '22:07', event: 'Service corridor movement', detail: 'A wheeled display case crosses the camera blind spot. No entry is recorded in the movement book.' },
      { time: '06:10', event: 'Missing folio discovered', detail: 'The west room is found open, with no damage to the door or lock.' },
    ],
    evidence: [
      { evidenceId: 'ev-01', type: 'message', title: 'A conversation after closing', timestamp: '20:58', description: 'A short exchange between the curator and the restoration specialist mentions the display case move.', messages: [{ sender: suspects[0].name, time: '20:58', content: 'The west case is still on the move list. I can take it downstairs.' }, { sender: suspects[1]?.name || 'Elliot Crane', time: '21:01', content: 'It wasn’t on the list when I checked. Leave it until I can look at the base.' }, { sender: suspects[0].name, time: '21:04', content: 'Already signed for. I’ll handle it.' }], clues: ['The claimed move was not scheduled.', 'Mara volunteered before the specialist approved it.'] },
      { evidenceId: 'ev-02', type: 'photo', title: 'The display case base', timestamp: '19:32', description: 'A fictional archive photograph taken during closing rounds. A fresh scrape is visible along the brass foot.', imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=80', clues: ['The scrape is fresh.', 'The case has a hollow plinth.'] },
      { evidenceId: 'ev-03', type: 'cctv', title: 'West hall / camera 04', timestamp: '21:42–22:07', cameraId: 'CAM 04', description: 'Simulated surveillance transcript: an empty corridor frame appears twice, then a display case rolls past the edge of view at 22:07.', clues: ['The frame repeats exactly.', 'The display case was moved during the blind interval.'] },
      { evidenceId: 'ev-04', type: 'witness', title: 'Statement from the night guard', timestamp: '06:25', witnessName: 'Owen Hart', statement: 'I did the usual round at a quarter to ten. The west room was dark. The curator was near the main stairs with a cart, but she told me the case was going to restoration in the morning.', clues: ['A cart was present after the room was supposedly secure.', 'The explanation was given before anyone had asked about the case.'] },
      { evidenceId: 'ev-05', type: 'document', title: 'Key ledger / west room', timestamp: '21:19', content: '21:04 — Duplicate key 2 signed out: M. Voss\n21:15 — East wing recorded as secured\n21:19 — Duplicate key 2 returned: M. Voss\n\nThe folio was discovered missing at 06:10. No forced entry was recorded.', description: 'An excerpt from the fictional archive key ledger.', clues: ['The duplicate key was returned four minutes after the wing was marked secure.', 'The ledger records a key, not a physical inspection.'] },
      { evidenceId: 'ev-06', type: 'document', title: 'Restoration move sheet', timestamp: '18:10', content: 'Scheduled: north gallery frame, cabinet 3.\nNo west room display case listed.\nHandwritten addition: “west case, basement — M.V.”', description: 'The day’s fictional move sheet, amended by hand.', clues: ['The case move was not part of the original schedule.', 'The initials identify who added it.'] },
    ],
    generationMode: 'DEMO',
  };
};
export async function generateMystery(input) {
  if (!env.geminiKey) {
    if (env.demoMode) return demoCase(input);
    throw new Error('Mystery generation is not configured. Add GEMINI_API_KEY or enable DEMO_MODE.');
  }
  const ai = new GoogleGenAI({ apiKey: env.geminiKey });
  const response = await ai.models.generateContent({ model: env.geminiModel, contents: mysteryPrompt(input), config: { responseMimeType: 'application/json', temperature: 0.7 } });
  let parsed;
  try { parsed = schema.parse(JSON.parse(response.text)); } catch { throw new Error('The generated case did not pass validation. Please try again.'); }
  if (!parsed.suspects.some((s) => s.suspectId === parsed.culpritId)) throw new Error('The generated case has an invalid solution. Please try again.');
  const ids = new Set(parsed.suspects.map((s) => s.suspectId));
  if (ids.size !== parsed.suspects.length || new Set(parsed.evidence.map((e) => e.evidenceId)).size !== parsed.evidence.length) throw new Error('Generated case identifiers must be unique.');
  for (const item of parsed.evidence.filter((e) => e.type === 'photo')) item.imageUrl ||= `https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=80`;
  return { ...parsed, generationMode: 'GEMINI', caseId: randomUUID() };
}
