import { useMemo } from "react"
import Fuse from "fuse.js"

export default function useSearch<T>({
  data,
  keys,
  searchQuery,
}: {
  data: T[]
  keys: string[]
  searchQuery: string
}) {
  const value = useMemo(() => {
    if (searchQuery) {
      const fuse = new Fuse(data, {
        includeScore: true,
        includeMatches: true,
        threshold: 0.3,
        keys: keys,
      })
      const results = fuse.search(searchQuery)
      const items = results.map((result) => result.item)
      return items
    }
    return data
  }, [data, searchQuery])
  return value
}
