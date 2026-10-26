import { Link, useParams } from 'react-router'
import { useData } from '../lib/store'
import { Img, SectionHead, useTitle, Empty } from '../components/Common'
import TourCard from '../components/TourCard'
import NotFound from './NotFound'
import { useState } from 'react'
import Lightbox from '../components/Lightbox'

export function Destinations() {
  const { destinations, tours } = useData()
  useTitle('Destinations', 'Explore temple towns, hill stations and heritage destinations.')
  return (
    <div className="container-x py-14">
      <SectionHead eyebrow="Destinations" title="Places we take you">Choose a destination to see the tours that include it.</SectionHead>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...destinations].sort((a, b) => a.order - b.order).map((x) => {
          const n = tours.filter((t) => t.published && t.stops.some((s) => s.destinationId === x.id)).length
          return (
            <Link key={x.id} to={`/destinations/${x.slug}`} className="card group overflow-hidden transition hover:shadow-xl hover:shadow-forest/10">
              <Img src={x.image} alt={x.name} className="aspect-[4/3] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
              <div className="p-5"><h3 className="text-xl text-forest">{x.name}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{x.description}</p><p className="mt-3 text-xs font-bold uppercase tracking-wider text-saffron-deep">{n} {n === 1 ? 'tour' : 'tours'}</p></div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function DestinationDetail() {
  const { slug } = useParams()
  const { destinations, tours, gallery } = useData()
  const x = destinations.find((d) => d.slug === slug)
  const [lb, setLb] = useState<number | null>(null)
  useTitle(x ? `${x.name} | Destinations` : 'Not found', x?.description)
  if (!x) return <NotFound />
  const list = tours.filter((t) => t.published && t.stops.some((s) => s.destinationId === x.id))
  const imgs = gallery.filter((g) => g.destinationId === x.id)
  return (
    <>
      <section className="relative isolate bg-forest-deep text-white">
        <img src={x.image} alt={x.name} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="container-x py-24"><p className="text-sm text-white/70"><Link to="/destinations" className="underline">Destinations</Link></p><h1 className="mt-3 text-5xl font-semibold">{x.name}</h1><p className="mt-4 max-w-2xl text-lg text-white/85">{x.description}</p></div>
      </section>
      <div className="container-x space-y-14 py-14">
        <section><h2 className="mb-6 text-3xl text-forest">Tours including {x.name}</h2>
          {list.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((t) => <TourCard key={t.id} tour={t} />)}</div>
            : <Empty title="No published tours yet" text="We can still arrange a custom trip here." action={<Link to="/contact" className="btn btn-saffron btn-sm">Request a custom tour</Link>} />}</section>
        {imgs.length > 0 && <section><h2 className="mb-6 text-3xl text-forest">Photos</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{imgs.map((g, i) => <button key={g.id} onClick={() => setLb(i)} aria-label={`Open ${g.caption}`}><Img src={g.src} alt={g.caption} className="aspect-square rounded-xl" /></button>)}</div></section>}
      </div>
      {lb !== null && <Lightbox images={imgs} index={lb} onClose={() => setLb(null)} onChange={setLb} />}
    </>
  )
}
