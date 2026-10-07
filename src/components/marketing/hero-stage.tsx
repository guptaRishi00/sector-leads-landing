'use client';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef, type ReactNode } from 'react';

/** Where the stage pins: the window's top settles under the 4.5rem header plus a little air (with RISE). */
const PIN_TOP = 156;
/** How far the window rises ahead of the page before it pins, so it slides over the fading copy. */
const RISE = 60;
/** How long (in scroll px) the stage stays pinned while the window settles and the cards come out. */
const PIN_LENGTH = 700;

/**
 * The hero's scroll choreography, after attio.com, and its draggable side cards. Scoped to the hero
 * section; targets are `[data-stage]` / `[data-drag]` elements, never the `[data-intro]` ones
 * HeroIntro animates, so the two never fight over a property.
 *
 * Scroll (ScrollTrigger, scrubbed and fed by Lenis; lg and up, never under reduced motion):
 *  1. `copy` (badge, headline, lead, buttons) fades, blurs and lifts away while the `window`, which
 *     starts at 1.2x, rises a little ahead of the page into the copy's place.
 *  2. The stage pins under the header; the window settles to its layout size (1x) and the three
 *     `card`s emerge from behind it, one after another, sliding outward to their spots.
 *  3. The pin ends and everything scrolls on. Scrolling back reverses all of it.
 * The window's layout size is its final size, so the hero's height fits the end state; the 1.2x
 * start overhangs into the hero's bottom padding, never into the next section.
 *
 * Drag (GSAP Draggable, lg and up): each `[data-drag]` card can be moved by hand inside
 * `[data-drag-zone]`, the line band from the buttons' bottom edge to the hero's bottom edge. The
 * bounds are computed from viewport rects and re-applied every frame while the hero is on screen
 * (the stage is pinned while the zone moves), so a dragged card is pushed along rather than ever
 * crossing into the next section.
 */
export function HeroStage({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = root.current;
    const hero = stage?.closest('section');
    if (stage === null || hero === null || hero === undefined) return;
    gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);
    const mm = gsap.matchMedia(hero);

    mm.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
      const win = stage.querySelector('[data-stage="window"]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-stage="card"]', stage);
      if (win === null) return;
      // The window ends RISE px above its layout box: hand that space back under the stage (the
      // wrapper's negative margin and the drag zone read --rise), so it doesn't pad the hero's end.
      gsap.set('[data-stage="visual"]', { '--rise': `${RISE}px` });

      gsap.to('[data-stage="copy"]', {
        autoAlpha: 0,
        y: -40,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '+=300', scrub: 0.6 },
      });
      // The backdrop's white veil eases back while the window rises, so more of the colour shows.
      gsap.to('[data-stage="veil"]', {
        scaleY: 0.72,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', endTrigger: stage, end: `top ${PIN_TOP}px`, scrub: 0.6 },
      });
      gsap.to(win, {
        y: -RISE,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', endTrigger: stage, end: `top ${PIN_TOP}px`, scrub: 0.6 },
      });

      const pinned = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: stage, start: `top ${PIN_TOP}px`, end: `+=${PIN_LENGTH}`, pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      pinned.fromTo(win, { scale: 1.2 }, { scale: 1, duration: 1 }, 0);
      pinned.fromTo(
        cards,
        { autoAlpha: 0, scale: 0.75, y: 40, x: (_, card: HTMLElement) => (card.dataset.from === 'right' ? -200 : 200) },
        { autoAlpha: 1, scale: 1, y: 0, x: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
        0.1,
      );
    });

    mm.add({ wide: '(min-width: 64rem)', calm: '(prefers-reduced-motion: reduce)' }, (context) => {
      const { wide, calm } = context.conditions ?? {};
      const zone = hero.querySelector('[data-drag-zone]');
      if (wide !== true || zone === null) return;
      // Bounds in the card's own x/y space, from viewport rects. Draggable's element bounds
      // mis-measure by the scroll offset while an ancestor is pinned (position: fixed), so they're
      // computed here instead: on press, and again whenever the page scrolls under a pinned card.
      const boundsFor = (drag: Draggable) => {
        const card = (drag.target as HTMLElement).getBoundingClientRect();
        const box = zone.getBoundingClientRect();
        return {
          minX: drag.x + box.left - card.left,
          maxX: drag.x + box.right - card.right,
          minY: drag.y + box.top - card.top,
          maxY: drag.y + box.bottom - card.bottom,
        };
      };
      const drags = Draggable.create(gsap.utils.toArray<HTMLElement>('[data-drag]', hero), {
        type: 'x,y',
        inertia: calm !== true,
        zIndexBoost: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
      });
      for (const drag of drags) drag.addEventListener('press', () => drag.applyBounds(boundsFor(drag)));
      // The zone scrolls while the stage is pinned, and the scrubbed pin timeline keeps moving the
      // cards for a moment after the scroll: re-clamp moved cards every frame while the hero is on
      // screen (nothing to do for cards still where they started, or one being held or thrown).
      const keep = ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top' });
      const clamp = () => {
        if (!keep.isActive) return;
        for (const drag of drags) {
          if (!drag.isPressed && !drag.isThrowing && (drag.x !== 0 || drag.y !== 0)) drag.applyBounds(boundsFor(drag));
        }
      };
      gsap.ticker.add(clamp);
      // Draggable instances aren't reverted by matchMedia; kill them when the condition ends.
      return () => {
        gsap.ticker.remove(clamp);
        keep.kill();
        for (const drag of drags) drag.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
