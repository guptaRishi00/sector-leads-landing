// Trimmed copy of the main app's src/lib/queue/view.ts: only the types the evidence panel and
// score breakdown render. The real file also builds these cards from database rows.

export interface ScoreLine {
  id: string;
  label: string;
  points: number;
  max: number;
  why: string;
}

/** One lead in the approval queue, as plain strings the client can render without formatting. */
export interface QueueCard {
  id: string;
  company: string;
  domain: string | null;
  country: string | null;
  score: { total: number; max: number; text: string; lines: ScoreLine[] };
  evidence: {
    source: string;
    trigger: string;
    title: string | null;
    snippet: string | null;
    href: string | null;
    happenedOn: string | null;
    happenedAt: string | null;
    freshness: string | null;
    /** Plain sentences, one per decision an AI model made on this lead. */
    modelDecisions: string[];
  };
}
