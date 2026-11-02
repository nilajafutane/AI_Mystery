export function mysteryPrompt(input) {
  return `You are a meticulous mystery author. Create a fictional, fair-play investigation. Return JSON only, no markdown. The culprit and solution must be determined before investigation begins. Make the timeline, testimony, alibis, messages and physical clues internally consistent; include red herrings that can be fairly resolved. The decisive clues must uniquely support the culprit. Never portray fictional content as real evidence.

User scenario: ${input.scenario}
Category: ${input.category}
Difficulty: ${input.difficulty}
Suspect count (exact): ${input.suspectCount}
Setting: ${input.setting}

Return one JSON object with:
caseNumber (string), title, introduction (2 sentences), description (2-4 sentences), location, dateTime, category, difficulty,
suspects (array of exactly the requested count; each: suspectId, name, age, occupation, relationship, description, alibi),
culpritId (one suspectId), motive, explanation (clear complete solution),
decisiveClues (array of 3-5 specific clues), timeline (4-7 items; each time, event, detail),
evidence (6-9 items; use a mix of message/photo/cctv/witness/document types; each item has evidenceId, type, title, description, timestamp, clues array. Messages additionally have messages array of {sender,time,content}; photos can have imagePrompt; cctv has cameraId; witness has witnessName and statement; documents have content).
Generate at least one item of each type. Use simple 24-hour clock timestamps on one coherent date. Evidence must support the solution without stating culpritId or motive in the public-facing text. Keep IDs stable and distinct.`;
}
