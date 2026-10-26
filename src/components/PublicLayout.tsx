import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react'
import { useData } from '../lib/store'
import { generalMessage, waLink } from '../lib/utils'
import { Logo, WhatsAppFloat } from './Common'
import { useEffect } from 'react'

const links = [
  ['/', 'Home'], ['/tours', 'Tour Packages'], ['/destinations', 'Destinations'], ['/gallery', 'Gallery'], ['/about', 'About Us'], ['/contact', 'Contact'],
]

export default function PublicLayout() {
  const { settings: s } = useData()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])
  const wa = waLink(s, generalMessage)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-ivory/90 backdrop-blur">
        <div className="container-x flex h-[72px] items-center justify-between">
          <Link to="/" aria-label="Home"><Logo s={s} /></Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `text-sm font-semibold transition hover:text-saffron-deep ${isActive ? 'text-saffron-deep' : 'text-forest'}`}>{label}</NavLink>
            ))}
            <Link to="/contact" className="btn btn-saffron btn-sm">Enquire Now</Link>
          </nav>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-line bg-ivory lg:hidden" aria-label="Mobile">
            <div className="container-x flex flex-col py-3">
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `border-b border-line/60 py-3.5 font-semibold ${isActive ? 'text-saffron-deep' : 'text-forest'}`}>{label}</NavLink>
              ))}
              <Link to="/contact" className="btn btn-saffron mt-4">Enquire Now</Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>
      <WhatsAppFloat href={wa} />

      <footer className="bg-forest-deep text-ivory/85">
        <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo s={s} light />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/70">{s.description}</p>
            <p className="mt-3 text-sm text-ivory/70">{s.footerText}</p>
            <div className="mt-5 flex gap-3">
              {(['facebook', 'instagram', 'youtube'] as const).map((k) =>
                s.social[k] ? <a key={k} href={s.social[k]} target="_blank" rel="noreferrer" className="rounded-full border border-white/25 px-4 py-2 text-sm capitalize hover:bg-white/10">{k}</a> : null)}
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-display text-lg text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              {links.map(([to, label]) => <li key={to}><Link to={to} className="hover:text-white">{label}</Link></li>)}
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-lg text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" />{s.phone || 'Add phone in Admin → Settings'}</li>
              <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" />{s.email || 'Add email in Admin → Settings'}</li>
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" />{s.address || 'Add address in Admin → Settings'}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-ivory/55">
          © {new Date().getFullYear()} {s.companyName}. Prices are estimates until confirmed by our team. <Link to="/admin/login" className="ml-2 underline">Admin</Link>
        </div>
      </footer>
    </div>
  )
}
