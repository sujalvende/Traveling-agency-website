import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Check, X as XIcon, Clock, MapPin, Info, MessageCircle, ChevronDown } from 'lucide-react'
import { useData, update, isAdminLoggedIn } from '../lib/store'
import { Img, DemoTag, useTitle } from '../components/Common'
import Itinerary from '../components/Itinerary'
import Estimator from '../components/Estimator'
import EnquiryForm from '../components/EnquiryForm'
import Lightbox from '../components/Lightbox'
import TourCard from '../components/TourCard'
import { inr, priceBadge } from '../lib/pricing'
import { routeOf, tourMessage, waLink } from '../lib/utils'
import NotFound from './NotFound'

export default function TourDetail() {
  const { slug } = useParams()
  const d = useData()
  const [sp] = useSearchParams()
  const preview = sp.get('preview') === '1' && isAdminLoggedIn()
  const tour = d.tours.find((t) => t.slug === slug && (t.published || preview))
  const [lb, setLb] = useState<number | null>(null)
  useTitle(tour ? `${tour.title} | ${d.settings.companyName}` : 'Tour not found', tour?.shortDescription)
  useEffect(() => {
    if (tour && tour.published && !sessionStorage.getItem('v_' + tour.id)) {
      sessionStorage.setItem('v_' + tour.id, '1')
      update((x) => ({ ...x, tourViews: { ...x.tourViews, [tour.id]: (x.tourViews[tour.id] ?? 0) + 1 } }))
    }
  }, [tour?.id])
  if (!tour) return <NotFound />

  const images = [{ src: tour.cover, caption: tour.title }, ...tour.gallery.map((g) => ({ src: g.src, caption: g.caption }))]
  const p = tour.pricing
  const price = priceBadge(p)
  const related = d.tours.filter((t) => t.published && t.id !== tour.id && (t.categoryIds.some((c) => tour.categoryIds.includes(c)))).slice(0, 3)
  const wa = waLink(d.settings, tourMessage(tour))
  const cats = d.categories.filter((c) => tour.categoryIds.includes(c.id))

  return (
    <>
      <section className="relative isolate bg-forest-deep text-white">
        <img src={tour.cover} alt={`${tour.title} cover photograph`} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        <div className="container-x py-20 md:py-28">
          <p className="text-sm text-white/70"><Link to="/tours" className="underline">Tour Packages</Link> / {cats[0]?.name ?? 'Tour'}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{tour.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{tour.shortDescription}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-2"><Clock size={16} />{tour.durationLabel}</span>
            <span className="flex items-center gap-2"><MapPin size={16} />{tour.stops.length} {tour.stops.length === 1 ? 'destination' : 'destinations'}</span>
            <span className="font-semibold text-gold">{price.text}</span>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="text-2xl text-forest">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-ink/85">{tour.description}</p>
            {tour.stops.length > 0 && <p className="mt-4 rounded-xl bg-sand p-4 text-sm"><strong className="text-forest">Route: </strong>{routeOf(tour)}</p>}
            {tour.departureInfo && <p className="mt-3 text-sm text-muted"><strong className="text-forest">Departure: </strong>{tour.departureInfo}</p>}
            {tour.isDemo && <p className="mt-3 text-xs text-gold">This package is demo content. Edit it from Admin → Tours.</p>}
          </section>

          {images.length > 1 && (
            <section>
              <h2 className="mb-4 text-2xl text-forest">Gallery</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {images.map((im, i) => (
                  <button key={i} onClick={() => setLb(i)} className={`overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`} aria-label={`Open image: ${im.caption}`}>
                    <Img src={im.src} alt={im.caption} className="h-full min-h-32 w-full [&_img]:transition-transform [&_img]:duration-500 hover:[&_img]:scale-105" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {tour.stops.length > 0 && <section><h2 className="mb-6 text-2xl text-forest">Itinerary</h2><Itinerary tour={tour} /></section>}

          <section id="pricing">
            <h2 className="mb-4 flex items-center gap-3 text-2xl text-forest">Pricing <DemoTag show={p.isDemo && p.mode !== 'custom'} /></h2>
            {p.mode === 'per_person' && (
              <div className="card p-5">
                <p className="font-display text-3xl text-saffron-deep">{p.perPerson ? `${inr(p.perPerson)} per person` : 'Contact for Pricing'}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {(p.minGroup || p.maxGroup) && <li>Group size: {p.minGroup ? `minimum ${p.minGroup}` : ''}{p.minGroup && p.maxGroup ? ', ' : ''}{p.maxGroup ? `maximum ${p.maxGroup}` : ''}</li>}
                  {p.perPersonExtra ? <li>Additional charge: {inr(p.perPersonExtra)}</li> : null}
                  {p.conditions && <li>{p.conditions}</li>}
                  {p.additionalCharges && <li>{p.additionalCharges}</li>}
                </ul>
              </div>
            )}
            {p.mode === 'per_vehicle' && (
              <div className="space-y-3">
                {p.vehicles.length === 0 && <p className="card p-5 text-muted">Request a Quote. Vehicle rates have not been published yet.</p>}
                {p.vehicles.map((v) => (
                  <div key={v.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-lg text-forest">{v.type} <span className="text-sm font-normal text-muted">· {v.seats} seats</span></h3>
                      <p className="mt-1 text-sm text-muted">{[v.included && `Includes: ${v.included}`, v.conditions, v.notes].filter(Boolean).join(' · ')}</p>
                      {v.extraCharge ? <p className="mt-1 text-sm text-muted">Additional charge: {inr(v.extraCharge)}</p> : null}
                    </div>
                    <p className="font-display text-2xl text-saffron-deep">{v.price ? `Vehicle package — ${inr(v.price)}` : 'Request a Quote'}</p>
                  </div>
                ))}
                {(p.conditions || p.additionalCharges) && <p className="text-sm text-muted">{p.conditions} {p.additionalCharges}</p>}
                <p className="text-xs text-muted">Vehicle availability is not guaranteed and must be confirmed by our team.</p>
              </div>
            )}
            {p.mode === 'custom' && (
              <div className="card p-6"><p className="font-display text-2xl text-forest">Contact us for the best package price.</p><p className="mt-2 text-sm text-muted">Share your destination, dates, group size and vehicle needs and we will prepare a personal quote.</p><a href="#enquire" className="btn btn-saffron mt-4">Request a Quote</a></div>
            )}
          </section>

          {p.mode !== 'custom' && <section><Estimator tour={tour} /></section>}

          <section className="grid gap-8 md:grid-cols-2">
            <div><h2 className="mb-3 text-2xl text-forest">Inclusions</h2><ul className="space-y-2">{tour.inclusions.map((x) => <li key={x} className="flex gap-2 text-sm"><Check size={17} className="mt-0.5 shrink-0 text-forest" />{x}</li>)}</ul></div>
            <div><h2 className="mb-3 text-2xl text-forest">Exclusions</h2><ul className="space-y-2">{tour.exclusions.map((x) => <li key={x} className="flex gap-2 text-sm"><XIcon size={17} className="mt-0.5 shrink-0 text-saffron-deep" />{x}</li>)}</ul></div>
          </section>

          {tour.travelInfo.length > 0 && (
            <section><h2 className="mb-3 text-2xl text-forest">Important travel information</h2>
              <ul className="space-y-2">{tour.travelInfo.map((x) => <li key={x} className="flex gap-2 text-sm"><Info size={17} className="mt-0.5 shrink-0 text-gold" />{x}</li>)}</ul></section>
          )}

          {tour.faqs.length > 0 && (
            <section><h2 className="mb-3 text-2xl text-forest">Frequently asked questions</h2>
              <div className="divide-y divide-line rounded-xl border border-line bg-paper">
                {tour.faqs.map((f) => (
                  <details key={f.q} className="group p-4"><summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-forest">{f.q}<ChevronDown size={18} className="transition group-open:rotate-180" /></summary><p className="mt-2 text-sm text-muted">{f.a}</p></details>
                ))}
              </div></section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" id="enquire">
          <div className="card p-6">
            <p className="font-display text-2xl text-saffron-deep">{price.text}</p>
            <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary mt-4 w-full"><MessageCircle size={18} />Enquire on WhatsApp</a>
            <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or send an enquiry<span className="h-px flex-1 bg-line" /></div>
            <EnquiryForm tourId={tour.id} compact />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bg-sand py-16"><div className="container-x"><h2 className="mb-8 text-3xl text-forest">You may also like</h2><div className="grid gap-6 md:grid-cols-3">{related.map((t) => <TourCard key={t.id} tour={t} />)}</div></div></section>
      )}
      {lb !== null && <Lightbox images={images} index={lb} onClose={() => setLb(null)} onChange={setLb} />}
    </>
  )
}
