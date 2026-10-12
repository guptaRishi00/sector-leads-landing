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
