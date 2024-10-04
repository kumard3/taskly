export function useUrlParams() {
  if (typeof window !== "undefined") {
    const url = window.location.href
    const parts = url.split("/")
    const lastPart = parts[parts.length - 1]

    return lastPart
  }
}
