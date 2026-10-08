// Adapted from Tremor Raw BarChart [v1.0.0], https://github.com/tremorlabs/tremor
// Copyright Tremor Labs, Inc. Licensed under the Apache License, Version 2.0
// (http://www.apache.org/licenses/LICENSE-2.0).
// Changes: the chart colours are this site's theme tokens; vertical bars only; the legend, tooltip,
// labels and click events are removed (the page's charts are illustrations with their own legend);
// the stacked top bar gets rounded corners; the first draw can animate (bars grow from the base).

'use client';

import { Bar, CartesianGrid, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { cn } from '@sl/ui';
import { chartColors, type ChartColor } from './tremor-chart-colors';

interface BarChartProps {
  data: readonly Record<string, number | string>[];
  index: string;
  categories: readonly string[];
  colors?: readonly ChartColor[];
  type?: 'default' | 'stacked';
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  minValue?: number;
  maxValue?: number;
  barCategoryGap?: string | number;
  /** Recharts' first-draw animation; off under reduced motion. */
  animate?: boolean;
  animationDuration?: number;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ['primary', 'muted'],
  type = 'default',
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  minValue = 0,
  maxValue,
  barCategoryGap = '10%',
  animate = false,
  animationDuration = 1200,
  className,
}: BarChartProps) {
  const stacked = type === 'stacked';
  const colorOf = (category: string) => colors[categories.indexOf(category) % colors.length] ?? 'primary';

  return (
    <div className={cn('h-80 w-full', className)} tremor-id="tremor-raw">
      <ResponsiveContainer>
        <RechartsBarChart data={[...data]} barCategoryGap={barCategoryGap} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
          {showGridLines ? <CartesianGrid className="stroke-border stroke-1" horizontal vertical={false} /> : null}
          <XAxis hide={!showXAxis} dataKey={index} fill="" stroke="" className="fill-muted-foreground text-xs" tickLine={false} axisLine={false} />
          <YAxis
            hide={!showYAxis}
            axisLine={false}
            tickLine={false}
            type="number"
            domain={[minValue, maxValue ?? 'auto']}
            fill=""
            stroke=""
            className="fill-muted-foreground text-xs"
          />
          {categories.map((category, position) => (
            <Bar
              key={category}
              className={chartColors[colorOf(category)].fill}
              name={category}
              dataKey={category}
              fill=""
              {...(stacked ? { stackId: 'stack' } : {})}
              radius={!stacked || position === categories.length - 1 ? [3, 3, 0, 0] : 0}
              isAnimationActive={animate}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
