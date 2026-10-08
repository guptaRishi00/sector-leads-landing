// Adapted from Tremor Raw AreaChart [v1.0.0], https://github.com/tremorlabs/tremor
// Copyright Tremor Labs, Inc. Licensed under the Apache License, Version 2.0
// (http://www.apache.org/licenses/LICENSE-2.0).
// Changes: the chart colours are this site's theme tokens instead of Tailwind's palette; the
// legend, tooltip, labels and click events are removed (the page's charts are illustrations with
// their own legend); the first draw can animate (Recharts' left-to-right reveal).

'use client';

import { useId } from 'react';
import { Area, CartesianGrid, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { cn } from '@sl/ui';
import { chartColors, type ChartColor } from './tremor-chart-colors';

interface AreaChartProps {
  data: readonly Record<string, number | string>[];
  index: string;
  categories: readonly string[];
  colors?: readonly ChartColor[];
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  minValue?: number;
  maxValue?: number;
  fill?: 'gradient' | 'solid' | 'none';
  /** Recharts' first-draw animation; off under reduced motion. */
  animate?: boolean;
  animationDuration?: number;
  className?: string;
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ['primary', 'muted'],
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  minValue = 0,
  maxValue,
  fill = 'gradient',
  animate = false,
  animationDuration = 1600,
  className,
}: AreaChartProps) {
  const areaId = useId().replace(/:/g, '');
  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
  const colorOf = (category: string) => colors[categories.indexOf(category) % colors.length] ?? 'primary';

  return (
    <div className={cn('h-80 w-full', className)} tremor-id="tremor-raw">
      <ResponsiveContainer>
        <RechartsAreaChart data={[...data]} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
          {showGridLines ? <CartesianGrid className="stroke-border stroke-1" horizontal vertical={false} /> : null}
          <XAxis
            padding={{ left: paddingValue, right: paddingValue }}
            hide={!showXAxis}
            dataKey={index}
            fill=""
            stroke=""
            className="fill-muted-foreground text-xs"
            tickLine={false}
            axisLine={false}
          />
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
          {categories.map((category) => {
            const categoryId = `${areaId}-${category.replace(/[^a-zA-Z0-9]/g, '')}`;
            const color = chartColors[colorOf(category)];
            return [
              <defs key={`${category}-fill`}>
                <linearGradient className={color.text} id={categoryId} x1="0" y1="0" x2="0" y2="1">
                  {fill === 'gradient' ? (
                    <>
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </>
                  ) : (
                    <stop stopColor="currentColor" stopOpacity={fill === 'none' ? 0 : 0.3} />
                  )}
                </linearGradient>
              </defs>,
              <Area
                key={category}
                className={color.stroke}
                name={category}
                type="linear"
                dataKey={category}
                stroke=""
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                dot={false}
                activeDot={false}
                isAnimationActive={animate}
                animationDuration={animationDuration}
                animationEasing="ease-out"
                fill={`url(#${categoryId})`}
              />,
            ];
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
