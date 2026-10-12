// Button hovers in the brand colour, by kind of button. `hover:` only applies on devices that can
// hover (Tailwind v4 wraps it in `@media (hover: hover)`), so this is the desktop treatment.

/** Dark "ink" buttons turn the brand blue. */
export const HOVER_INK = 'hover:bg-primary hover:text-primary-foreground';

/** Blue buttons deepen to a richer brand blue (in the dark theme, where the blue is light, it lifts instead). */
export const HOVER_PRIMARY = 'hover:bg-[color-mix(in_oklab,var(--primary)_80%,var(--foreground))]';

/**
 * Ink buttons inside a dark-scoped surface (the footer): there `--primary` is the dark palette's pale
 * blue, which barely reads as the brand, so these take `--brand`, the page's own primary, set on the
 * shell outside the dark scope (MarketingShell). In the dark theme that is the dark primary anyway.
 */
export const HOVER_INK_ON_DARK = 'hover:bg-(--brand) hover:text-(--brand-foreground)';

/** Outlined and plain buttons take on the brand: blue text, a blue edge and the pale selection tint. */
export const HOVER_PLAIN = 'hover:border-primary/50 hover:bg-selected hover:text-primary';
