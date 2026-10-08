// Adapted from Tremor Raw chartColors [v0.1.0], https://github.com/tremorlabs/tremor
// Copyright Tremor Labs, Inc. Licensed under the Apache License, Version 2.0
// (http://www.apache.org/licenses/LICENSE-2.0).
// Changes: the colours are this site's theme tokens instead of Tailwind's palette.

export const chartColors = {
  primary: { stroke: 'stroke-primary', fill: 'fill-primary', text: 'text-primary' },
  muted: { stroke: 'stroke-muted-foreground/60', fill: 'fill-muted-foreground/25', text: 'text-muted-foreground' },
} as const;

export type ChartColor = keyof typeof chartColors;
