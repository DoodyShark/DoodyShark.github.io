// page_content keys holding the transcript PDF URLs (locale 'en').
export const TRANSCRIPTS = [
  { pageKey: 'transcript-merged-url',    label: 'Merged Transcript (all degrees)' },
  { pageKey: 'transcript-masters-url',   label: "Master's Transcript"   },
  { pageKey: 'transcript-bachelors-url', label: "Bachelor's Transcript" },
] as const;

export type TranscriptKey = (typeof TRANSCRIPTS)[number]['pageKey'];
