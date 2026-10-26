import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { Search, ArrowRight, Route, Car, IndianRupee, MessageCircle, Users, Shuffle, Quote } from 'lucide-react'
import { useData } from '../lib/store'
import { Img, Logo, SectionHead, useTitle, DemoTag } from '../components/Common'
import TourCard from '../components/TourCard'

const icons = [Route, Car, IndianRupee, MessageCircle, Users, Shuffle]

export default function Home() {
  const d = useData()
  const s = d.settings
  const nav = useNavigate()
  const [q, setQ] = useState('')
  useTitle(`${s.companyName} | Pilgrimage & Tour Packages`, s.description.slice(0, 155))
  const published = d.tours.filter((t) => t.published)
  const featured = (published.filter((t) => t.featured).length ? published.filter((t) => t.featured) : published).slice(0, 6)
  const cats = d.categories

  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-deep text-white">
        <img src={s.heroImage} alt="Temple architecture against the sky" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/90 via-forest-deep/50 to-transparent" />
        <div className="container-x flex min-h-[78vh] flex-col justify-center py-20">
          <div className="rise max-w-2xl">
            <div className="mb-8"><Logo s={s} light /></div>
            <h1 className="text-5xl font-semibold leading-[1.05] md:text-7xl">Every Journey Has a Beautiful Destination.</h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">Discover meaningful journeys, comfortable travel, and memorable experiences with thoughtfully planned tour packages.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tours" className="btn btn-saffron">Explore Tour Packages <ArrowRight size={18} /></Link>
              <Link to="/contact" className="btn btn-light">Plan Your Trip</Link>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); nav(`/tours?q=${encodeURIComponent(q)}`) }} className="mt-10 flex max-w-lg gap-2 rounded-full bg-white p-1.5 shadow-xl">
              <label className="sr-only" htmlFor="hero-q">Search tours or destinations</label>
              <Search className="ml-3 self-center text-muted" size={18} />
              <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a tour or destination" className="min-w-0 flex-1 bg-transparent px-2 text-ink outline-none" />
              <button className="btn btn-primary btn-sm">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHead eyebrow="Tour Packages" title="Discover your next journey" action={<Link to="/tours" className="btn btn-outline btn-sm">View all tours</Link>}>
          Pilgrimage routes, family holidays and sightseeing trips planned with care.
        </SectionHead>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featured.map((t) => <TourCard key={t.id} tour={t} />)}</div>
      </section>

      <section className="bg-sand py-20">
        <div className="container-x">
          <SectionHead eyebrow="Categories" title="Browse by the kind of trip" />
          <div className="flex flex-wrap gap-3">
            {cats.map((c) => (
              <Link key={c.id} to={`/tours?category=${c.id}`} className="rounded-full border border-forest/25 bg-paper px-5 py-3 font-semibold text-forest transition hover:bg-forest hover:text-ivory">{c.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHead eyebrow="Destinations" title="Popular destinations" action={<Link to="/destinations" className="btn btn-outline btn-sm">All destinations</Link>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {[...d.destinations].sort((a, b) => a.order - b.order).slice(0, 5).map((x, i) => (
            <Link key={x.id} to={`/destinations/${x.slug}`} className={`group relative block overflow-hidden rounded-2xl ${i === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}`}>
              <Img src={x.image} alt={x.name} className={`h-full w-full ${i === 0 ? 'min-h-[22rem]' : 'aspect-[4/3]'} [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105`} />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="text-2xl font-semibold">{x.name}</h3>
                <p className="mt-1 line-clamp-2 max-w-sm text-sm text-white/80">{x.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-forest py-20 text-ivory">
        <div className="container-x">
          <div className="mb-12 max-w-2xl"><p className="eyebrow !text-gold mb-3">Why choose us</p><h2 className="text-3xl font-semibold text-white md:text-4xl">Travel that is simple to plan and easy to trust</h2></div>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {s.strengths.map((x, i) => { const I = icons[i % icons.length]; return (
              <div key={x.id} className="flex gap-4 border-t border-white/15 pt-5">
                <I className="mt-1 shrink-0 text-gold" size={24} />
                <div><h3 className="text-xl font-semibold text-white">{x.title}</h3><p className="mt-1 text-sm text-ivory/75">{x.text}</p></div>
              </div>) })}
          </div>
        </div>
      </section>

      {d.testimonials.length > 0 && (
        <section className="container-x py-20">
          <SectionHead eyebrow="Testimonials" title="Words from travellers" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {d.testimonials.map((t) => (
              <figure key={t.id} className="card p-6">
                <Quote className="text-gold" size={24} />
                <blockquote className="mt-3 text-ink">{t.text}</blockquote>
                <figcaption className="mt-4 flex items-center gap-2 text-sm font-semibold text-forest">{t.name}, <span className="font-normal text-muted">{t.place}</span><DemoTag show={t.isDemo} /></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-saffron p-8 text-white md:flex-row md:items-center md:p-12">
          <div><h2 className="text-3xl font-semibold md:text-4xl">Not sure which tour fits?</h2><p className="mt-2 max-w-lg text-white/90">Tell us where you want to go and who is travelling. We will suggest a plan.</p></div>
          <Link to="/contact" className="btn bg-white text-forest hover:bg-ivory">Plan Your Trip</Link>
        </div>
      </section>
    </>
  )
}
