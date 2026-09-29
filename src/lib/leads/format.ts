// Trimmed copy of the main app's src/lib/leads/format.ts: only the two helpers the evidence
// panel and score breakdown use.

export function hostOf(href: string): string {
  return new URL(href).hostname.replace(/^www\./, '');
}

/** Score points to one decimal place at most: 12, 12.5. */
export function pointsText(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}
