import { Link } from 'react-router'
import { Clock, MapPin, ArrowRight } from 'lucide-react'
import type { Tour } from '../lib/types'
import { priceBadge } from '../lib/pricing'
import { routeOf } from '../lib/utils'
import { Img, DemoTag } from './Common'

export default function TourCard({ tour }: { tour: Tour }) {
  const price = priceBadge(tour.pricing)
  const places = tour.stops.length
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/10">
      <Link to={`/tours/${tour.slug}`} className="block">
        <Img src={tour.cover} alt={`${tour.title} cover photograph`} className="aspect-[4/3] [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="eyebrow !text-[10px]">{price.type}</span>
          <DemoTag show={tour.pricing.isDemo && price.text !== 'Request a Quote' && price.text !== 'Contact for Pricing'} />
        </div>
        <h3 className="text-xl font-semibold leading-snug text-forest"><Link to={`/tours/${tour.slug}`}>{tour.title}</Link></h3>
        {places > 0 && <p className="mt-2 flex gap-1.5 text-sm text-muted"><MapPin size={15} className="mt-0.5 shrink-0" /><span className="line-clamp-2">{routeOf(tour)}</span></p>}
        <p className="mt-2 flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5"><Clock size={15} />{tour.durationLabel}</span>
          {places > 0 && <span>{places} {places === 1 ? 'place' : 'places'}</span>}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4 mt-5">
          <p className="font-display text-lg font-semibold text-saffron-deep">{price.text}</p>
          <Link to={`/tours/${tour.slug}`} className="btn btn-primary btn-sm whitespace-nowrap">Explore Tour <ArrowRight size={15} /></Link>
        </div>
      </div>
    </article>
  )
}
