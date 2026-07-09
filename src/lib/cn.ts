import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class names and de-duplicate conflicting Tailwind
// utilities. Shared by the vendored MagicUI components (magicui.design).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
