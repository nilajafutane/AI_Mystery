import { createContext, useContext, useMemo, useState } from 'react';
const Context = createContext(null);
export function InvestigationProvider({ children }) {
  const [caseData, setCaseData] = useState(null);
  const [result, setResult] = useState(null);
  const [sessionId] = useState(() => { let id = localStorage.getItem('mystery-session'); if (!id) { id = crypto.randomUUID(); localStorage.setItem('mystery-session', id); } return id; });
  const value = useMemo(() => ({ caseData, setCaseData, result, setResult, sessionId }), [caseData, result, sessionId]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useInvestigation = () => useContext(Context);
