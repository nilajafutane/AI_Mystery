import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', timeout: 30000 });
export const generateCase = (payload) => api.post('/cases/generate', payload, { timeout: 300000 }).then((r) => r.data.data);
export const getCase = (id, sessionId) => api.get(`/cases/${id}`, { headers: { 'x-session-id': sessionId } }).then((r) => r.data.data);
export const submitCase = (id, suspectId, sessionId) => api.post(`/cases/${id}/submit`, { suspectId, sessionId }).then((r) => r.data.data);
export const getResult = (id, resultId, sessionId) => api.get(`/cases/${id}/result/${resultId}`, { headers: { 'x-session-id': sessionId } }).then((r) => r.data.data);
export const getNotes = (id, sessionId) => api.get(`/cases/${id}/notes`, { headers: { 'x-session-id': sessionId } }).then((r) => r.data.data);
export const saveNotes = (id, sessionId, notes) => api.put(`/cases/${id}/notes`, { notes }, { headers: { 'x-session-id': sessionId } }).then((r) => r.data.data);
export const setBookmark = (id, evidenceId, sessionId, bookmarked) => api({ method: bookmarked ? 'POST' : 'DELETE', url: `/cases/${id}/evidence/${evidenceId}/bookmark`, headers: { 'x-session-id': sessionId } });
