import { cx } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// shadcn's cn(): clsx semantics (cva re-exports clsx as `cx`) + tailwind-merge conflict resolution.
export type ClassValue = Parameters<typeof cx>[number];

export function cn(...inputs: ClassValue[]): string {
  return twMerge(cx(inputs));
}
