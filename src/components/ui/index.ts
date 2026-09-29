// The slice of the main app's shared UI package (`@sl/ui`, packages/ui/src) that the landing
// page uses, copied unchanged. tsconfig maps `@sl/ui` to this file, so the marketing components
// keep their original imports. The component files mirror packages/ui/src/components/*.
export { cn, type ClassValue } from './lib/cn';
export { THEME_STORAGE_KEY, themeScript, type ThemePreference } from './theme-script';
export * as Icons from './icons';

export { Badge, badgeVariants, type BadgeProps, type BadgeVariant } from './components/badge';
export {
  Button,
  buttonVariants,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from './components/button';
export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
  type FieldProps,
} from './components/field';
export { Input } from './components/input';
export { Label } from './components/label';
export { Separator } from './components/separator';
export {
  ThemeToggle,
  setThemePreference,
  useThemePreference,
  type ThemeToggleProps,
} from './components/theme-toggle';
