import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

// Adapted from shadcn/ui new-york-v4 badge: rounded-md instead of a pill (reads as a
// label, not a button), quiet semantic variants that keep status off the accent, and a
// solid destructive with dark text in dark mode (4.5:1).
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-1.5 py-0.5 text-xs leading-4 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white dark:text-destructive-foreground [a&]:hover:bg-destructive/90',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
        success: 'border-transparent bg-success-soft text-success',
        warning: 'border-warning-border bg-warning-soft text-warning-foreground',
        muted: 'border-border bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeProps = React.ComponentProps<typeof Badge>;

export type Tier = 'A' | 'B' | 'C' | 'X';

const TIER_LABEL: Readonly<Record<Tier, string>> = {
  A: 'Tier A',
  B: 'Tier B',
  C: 'Tier C',
  X: 'Disqualified',
};

export interface TierChipProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  tier: Tier;
  // Spoken instead of the default "Tier A" style label.
  label?: string;
}

// Neutral on purpose: tier is information, not status or brand.
export function TierChip({ tier, label = TIER_LABEL[tier], className, ...props }: TierChipProps) {
  return (
    <Badge
      variant="muted"
      className={cn('min-w-5 px-1 font-mono text-[11px] tabular-nums', className)}
      {...props}
    >
      <span aria-hidden="true">{tier === 'X' ? '✕' : tier}</span>
      <span className="sr-only">{label}</span>
    </Badge>
  );
}
