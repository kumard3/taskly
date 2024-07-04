export function truncateText(
  text: string,
  maxLength: number,
  lastChars?: number,
) {
  if (text) {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);

    if (lastChars)
      return truncated + "..." + text.substring(text.length - lastChars);
    return truncated + "...";
  }
}
