'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { Button, Icons } from '@sl/ui';

const LINK =
  'flex h-11 items-center rounded-md px-2 text-[15px] text-foreground/85 transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ring';

/** The section menu below `lg`, where the header has no room for the nav. Closes on a link, Escape or resize. */
export function MobileNav({ items }: { items: readonly { href: string; label: string }[] }) {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const wide = window.matchMedia('(min-width: 64rem)');
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', close);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon-sm" aria-expanded={open} aria-controls={id} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
        {open ? <Icons.X aria-hidden="true" /> : <Icons.Menu aria-hidden="true" />}
      </Button>
      <nav id={id} aria-label="Page sections" hidden={!open} className="absolute inset-x-0 top-full mt-2 rounded-2xl border bg-background p-2 shadow-[0_16px_40px_-16px_var(--shadow-color)]">
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={LINK} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-1 border-t pt-1 sm:hidden">
            <Link href="/sign-in" className={LINK} onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
