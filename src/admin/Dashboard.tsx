import { Link } from 'react-router'
import { useData } from '../lib/store'
import { fmtDate } from '../lib/utils'

export default function Dashboard() {
  const { tours, enquiries, tourViews } = useData()
  const stats = [
    ['Published tours', tours.filter((t) => t.published).length], ['Draft tours', tours.filter((t) => !t.published).length],
    ['Total enquiries', enquiries.length], ['New enquiries', enquiries.filter((e) => e.status === 'New').length],
  ]
  const byTour = Object.entries(enquiries.reduce<Record<string, number>>((a, e) => (e.tourId ? { ...a, [e.tourId]: (a[e.tourId] ?? 0) + 1 } : a), {})).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const views = Object.entries(tourViews).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const name = (id: string) => tours.find((t) => t.id === id)?.title ?? 'Deleted tour'
  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-forest">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([l, v]) => <div key={l} className="card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted">{l}</p><p className="mt-2 font-display text-4xl text-forest">{v}</p></div>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5"><h2 className="mb-3 text-xl text-forest">Recent enquiries</h2>
          {enquiries.length === 0 ? <p className="text-sm text-muted">No enquiries yet.</p> : <ul className="divide-y divide-line">{enquiries.slice(0, 5).map((e) => <li key={e.id} className="py-3 text-sm"><p className="font-semibold">{e.name} <span className="font-normal text-muted">· {e.status}</span></p><p className="text-muted">{e.tourTitle} · {fmtDate(e.createdAt)}</p></li>)}</ul>}
          <Link to="/admin/enquiries" className="mt-3 inline-block text-sm font-semibold text-forest underline">Manage enquiries</Link></section>
        <section className="card p-5"><h2 className="mb-3 text-xl text-forest">Most enquired tours</h2>
          {byTour.length === 0 ? <p className="text-sm text-muted">Appears once enquiries are received.</p> : <ul className="space-y-2 text-sm">{byTour.map(([id, n]) => <li key={id} className="flex justify-between gap-3"><span>{name(id)}</span><b>{n}</b></li>)}</ul>}
          <h2 className="mb-3 mt-6 text-xl text-forest">Most viewed (this browser)</h2>
          {views.length === 0 ? <p className="text-sm text-muted">Appears once tour pages are viewed.</p> : <ul className="space-y-2 text-sm">{views.map(([id, n]) => <li key={id} className="flex justify-between gap-3"><span>{name(id)}</span><b>{n}</b></li>)}</ul>}
        </section>
      </div>
    </div>
  )
}
