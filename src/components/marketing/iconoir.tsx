import type { ReactNode, SVGProps } from 'react';

/*
 * A few Iconoir icons (https://iconoir.com, v7.12.1, "regular"), inlined so the page needs no new
 * dependency and loads nothing from a third-party host. Paths are Iconoir's own; the stroke width
 * comes from the root (thin by default, 1.2 against Iconoir's 1.5) and the colour from currentColor.
 *
 * Iconoir is MIT licensed: Copyright (c) 2021 Luca Burgio. Permission is hereby granted, free of
 * charge, to any person obtaining a copy of this software and associated documentation files, to
 * deal in the Software without restriction, subject to including this notice. THE SOFTWARE IS
 * PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

export type IconoirProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

function icon(paths: ReactNode) {
  return function Iconoir({ strokeWidth = 1.2, ...props }: IconoirProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const Megaphone = icon(
  <>
    <path d="M14 14V6M14 14L20.1023 17.487C20.5023 17.7156 21 17.4268 21 16.9661V3.03391C21 2.57321 20.5023 2.28439 20.1023 2.51296L14 6M14 14H7C4.79086 14 3 12.2091 3 10V10C3 7.79086 4.79086 6 7 6H14" />
    <path d="M7.75716 19.3001L7 14H11L11.6772 18.7401C11.8476 19.9329 10.922 21 9.71716 21C8.73186 21 7.8965 20.2755 7.75716 19.3001Z" />
  </>,
);

export const CheckCircle = icon(
  <>
    <path d="M7 12.5L10 15.5L17 8.5" />
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
  </>,
);

export const Globe = icon(
  <>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M2.5 12.5L8 14.5L7 18L8 21" />
    <path d="M17 20.5L16.5 18L14 17V13.5L17 12.5L21.5 13" />
    <path d="M19 5.5L18.5 7L15 7.5V10.5L17.5 9.5H19.5L21.5 10.5" />
    <path d="M2.5 10.5L5 8.5L7.5 8L9.5 5L8.5 3" />
  </>,
);

export const ShieldCheck = icon(
  <>
    <path d="M8.5 11.5L11.5 14.5L16.5 9.5" />
    <path d="M5 18L3.13036 4.91253C3.05646 4.39524 3.39389 3.91247 3.90398 3.79912L11.5661 2.09641C11.8519 2.03291 12.1481 2.03291 12.4339 2.09641L20.096 3.79912C20.6061 3.91247 20.9435 4.39524 20.8696 4.91252L19 18C18.9293 18.495 18.5 21.5 12 21.5C5.5 21.5 5.07071 18.495 5 18Z" />
  </>,
);

/**
 * Supabase-style line art: an Iconoir icon set large in a dark card, as decoration. Every path keeps
 * a hairline stroke however big the icon is drawn (non-scaling stroke, 1px); the caller sets its
 * size, position and colour, and puts it behind the card's content (-z-10 in an isolated parent).
 */
export const LINE_ART = 'pointer-events-none absolute -z-10 [&_path]:[vector-effect:non-scaling-stroke]';

export const Bank = icon(
  <>
    <path d="M3 9.5L12 4L21 9.5" />
    <path d="M5 20H19" />
    <path d="M10 9L14 9" />
    <path d="M6 17L6 12" />
    <path d="M10 17L10 12" />
    <path d="M14 17L14 12" />
    <path d="M18 17L18 12" />
  </>,
);

export const PageStar = icon(
  <>
    <path d="M20 12V5.74853C20 5.5894 19.9368 5.43679 19.8243 5.32426L16.6757 2.17574C16.5632 2.06321 16.4106 2 16.2515 2H4.6C4.26863 2 4 2.26863 4 2.6V21.4C4 21.7314 4.26863 22 4.6 22H11" />
    <path d="M8 10H16M8 6H12M8 14H11" />
    <path d="M16.3056 17.1133L17.2147 15.1856C17.3314 14.9381 17.6686 14.9381 17.7853 15.1856L18.6944 17.1133L20.7275 17.4243C20.9884 17.4642 21.0923 17.7998 20.9035 17.9923L19.4326 19.4917L19.7797 21.61C19.8243 21.882 19.5515 22.0895 19.3181 21.961L17.5 20.9603L15.6819 21.961C15.4485 22.0895 15.1757 21.882 15.2203 21.61L15.5674 19.4917L14.0965 17.9923C13.9077 17.7998 14.0116 17.4642 14.2725 17.4243L16.3056 17.1133Z" />
    <path d="M16 2V5.4C16 5.73137 16.2686 6 16.6 6H20" />
  </>,
);
