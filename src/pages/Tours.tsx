import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { useData } from '../lib/store'
import { Empty, SectionHead, useTitle } from '../components/Common'
import TourCard from '../components/TourCard'
import { estimateSort } from '../lib/sort'

export default function Tours() {
  const { tours, categories, destinations } = useData()
  const [sp, setSp] = useSearchParams()
  useTitle('Tour Packages', 'Browse pilgrimage, temple darshan, family and sightseeing tour packages.')
  const q = sp.get('q') ?? ''
  const category = sp.get('category') ?? ''
  const duration = sp.get('duration') ?? ''
  const pricing = sp.get('pricing') ?? ''
  const sort = sp.get('sort') ?? 'featured'
  const dest = sp.get('destination') ?? ''
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }

  const list = useMemo(() => {
    let r = tours.filter((t) => t.published)
    const needle = q.trim().toLowerCase()
    if (needle) r = r.filter((t) => (t.title + ' ' + t.shortDescription + ' ' + t.stops.map((s) => s.name).join(' ')).toLowerCase().includes(needle))
    if (category) r = r.filter((t) => t.categoryIds.includes(category))
    if (dest) r = r.filter((t) => t.stops.some((s) => s.destinationId === dest))
    if (duration === '1') r = r.filter((t) => t.durationDays <= 1)
    if (duration === '2-3') r = r.filter((t) => t.durationDays >= 2 && t.durationDays <= 3)
    if (duration === '4+') r = r.filter((t) => t.durationDays >= 4)
    if (pricing) r = r.filter((t) => t.pricing.mode === pricing)
    return estimateSort(r, sort)
  }, [tours, q, category, duration, pricing, sort, dest])

  const clear = () => setSp({}, { replace: true })
  return (
    <div className="container-x py-14">
      <SectionHead eyebrow="Tour Packages" title="Find your tour">Search by name or destination, then narrow down with filters.</SectionHead>
      <div className="card mb-8 grid gap-3 p-4 md:grid-cols-6">
        <div className="relative md:col-span-2">
          <label htmlFor="tq" className="sr-only">Search</label>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input id="tq" className="field !pl-9" placeholder="Search tour or destination" value={q} onChange={(e) => set('q', e.target.value)} />
        </div>
        <select aria-label="Category" className="field" value={category} onChange={(e) => set('category', e.target.value)}>
          <option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select aria-label="Duration" className="field" value={duration} onChange={(e) => set('duration', e.target.value)}>
          <option value="">Any duration</option><option value="1">1 day</option><option value="2-3">2–3 days</option><option value="4+">4+ days</option>
        </select>
        <select aria-label="Pricing type" className="field" value={pricing} onChange={(e) => set('pricing', e.target.value)}>
          <option value="">Any pricing</option><option value="per_person">Per person</option><option value="per_vehicle">Per vehicle</option><option value="custom">Custom quote</option>
        </select>
        <select aria-label="Sort" className="field" value={sort} onChange={(e) => set('sort', e.target.value)}>
          <option value="featured">Featured first</option><option value="newest">Newest</option><option value="duration">Shortest duration</option><option value="name">Name A–Z</option>
        </select>
        {destinations.length > 0 && dest && <p className="text-sm text-muted md:col-span-6">Showing tours via {destinations.find((x) => x.id === dest)?.name}. <button className="underline" onClick={() => set('destination', '')}>Remove</button></p>}
      </div>
      <p className="mb-5 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? 'tour' : 'tours'} found</p>
      {list.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((t) => <TourCard key={t.id} tour={t} />)}</div>
      ) : (
        <Empty title="No tours match your search" text="Try a different destination or clear the filters. We also arrange custom tours." action={<div className="flex justify-center gap-3"><button onClick={clear} className="btn btn-outline btn-sm">Clear filters</button><Link to="/contact" className="btn btn-saffron btn-sm">Request a custom tour</Link></div>} />
      )}
    </div>
  )
}
