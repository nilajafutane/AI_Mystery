import mongoose from 'mongoose';
const NotesSchema = new mongoose.Schema({
  caseId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  notes: { type: String, maxlength: 10000, default: '' }, bookmarks: { type: [String], default: [] },
}, { timestamps: true });
NotesSchema.index({ caseId: 1, sessionId: 1 }, { unique: true });
const SubmissionSchema = new mongoose.Schema({
  resultId: { type: String, unique: true }, caseId: { type: String, index: true },
  sessionId: String, suspectId: String, correct: Boolean, submittedAt: Date,
}, { timestamps: true });
export const InvestigationData = mongoose.models.InvestigationData || mongoose.model('InvestigationData', NotesSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
