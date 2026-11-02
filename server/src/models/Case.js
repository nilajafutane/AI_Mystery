import mongoose from 'mongoose';
const Suspect = new mongoose.Schema({
  suspectId: { type: String, required: true }, name: String, age: Number, occupation: String,
  relationship: String, description: String, alibi: String,
}, { _id: false });
const Timeline = new mongoose.Schema({ time: String, event: String, detail: String }, { _id: false });
const Evidence = new mongoose.Schema({
  evidenceId: { type: String, required: true }, type: { type: String, enum: ['message', 'photo', 'cctv', 'witness', 'document'] },
  title: String, description: String, timestamp: String, messages: [{ sender: String, time: String, content: String }],
  imageUrl: String, statement: String, witnessName: String, cameraId: String, content: String, clues: [String],
}, { _id: false });
const CaseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true, index: true }, caseNumber: String, title: String, category: String,
  difficulty: String, introduction: String, description: String, location: String, dateTime: String,
  suspects: [Suspect], culpritId: { type: String, required: true, select: false }, motive: { type: String, required: true, select: false },
  explanation: { type: String, required: true, select: false }, decisiveClues: { type: [String], select: false },
  timeline: [Timeline], evidence: [Evidence], status: { type: String, enum: ['active', 'submitted', 'completed'], default: 'active' },
  submittedSuspectId: String, submittedAt: Date, resultId: String, generationMode: String,
}, { timestamps: true, minimize: false });
export const Case = mongoose.models.Case || mongoose.model('Case', CaseSchema);
export const EvidenceSchema = Evidence;
