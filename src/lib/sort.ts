import type { Tour } from './types'

export function estimateSort(r: Tour[], sort: string) {
  const a = [...r]
  if (sort === 'newest') a.sort((x, y) => y.createdAt.localeCompare(x.createdAt))
  else if (sort === 'duration') a.sort((x, y) => x.durationDays - y.durationDays)
  else if (sort === 'name') a.sort((x, y) => x.title.localeCompare(y.title))
  else a.sort((x, y) => Number(y.featured) - Number(x.featured))
  return a
}
