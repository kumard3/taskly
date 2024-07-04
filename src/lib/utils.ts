import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hashStringToColorHex = (id: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(id);
  const hexCode = hash.digest("hex").slice(0, 6);
  return `#${hexCode}`;
};

export function truncateText(
  text: string,
  maxLength: number,
  lastChars?: number,
) {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);

  if (lastChars)
    return truncated + "..." + text.substring(text.length - lastChars);
  return truncated + "...";
}
