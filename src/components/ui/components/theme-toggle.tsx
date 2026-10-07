'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { cn } from '../lib/cn';
import { THEME_STORAGE_KEY, type ThemePreference } from '../theme-script';

const listeners = new Set<() => void>();
let memoryPreference: ThemePreference | undefined;

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'system' ? stored : 'light';
  } catch {
    return memoryPreference ?? 'light';
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyAttribute(readPreference());
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

// Transitions are switched off (theme.css, [data-theme-switching]) while the colours swap,
// so nothing animates from the old theme to the new one. Light, the default, is the absence of the
// attribute; "system" is set explicitly so theme.css follows the OS only then.
function applyAttribute(preference: ThemePreference): void {
  const root = document.documentElement;
  root.setAttribute('data-theme-switching', '');
  if (preference === 'light') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', preference);
  // Reading a computed style flushes the new colours while transitions are still off.
  void window.getComputedStyle(root).color;
  window.requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
}

export function setThemePreference(preference: ThemePreference): void {
  applyAttribute(preference);
  try {
    if (preference === 'light') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    memoryPreference = preference;
  }
  for (const listener of listeners) listener();
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, readPreference, () => 'light');
}

const options: readonly { value: ThemePreference; label: string; Icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const preference = useThemePreference();

  return (
    <RadioGroupPrimitive.Root
      aria-label="Theme"
      orientation="horizontal"
      value={preference}
      onValueChange={(value) => {
        if (isPreference(value)) setThemePreference(value);
      }}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-0.5 rounded-lg border bg-muted/60 p-0.5',
        className,
      )}
    >
      {options.map(({ value, label, Icon }) => (
        <RadioGroupPrimitive.Item
          key={value}
          value={value}
          aria-label={label}
          title={label}
          className={cn(
            'inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground',
            'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:outline-ring',
            'data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-xs dark:data-[state=checked]:bg-accent',
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
