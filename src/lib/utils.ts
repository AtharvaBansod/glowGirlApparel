import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It uses `clsx` to handle conditional classes and `tailwind-merge`
 * to intelligently merge Tailwind CSS classes without style conflicts.
 * @param inputs - A list of class names or conditional class objects.
 * @returns A string of merged and cleaned class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}