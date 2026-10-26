import { useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router'
import { LayoutDashboard, Map, MapPin, Tags, Images, Inbox, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { isAdminLoggedIn, logoutAdmin, useData } from '../lib/store'

const items = [
  ['/admin/dashboard', 'Dashboard', LayoutDashboard], ['/admin/tours', 'Tours', Map], ['/admin/destinations', 'Destinations', MapPin],
  ['/admin/categories', 'Categories', Tags], ['/admin/gallery', 'Gallery', Images], ['/admin/enquiries', 'Enquiries', Inbox], ['/admin/settings', 'Settings', Settings],
] as const

export default function AdminLayout() {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const { settings, enquiries } = useData()
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace />
  const fresh = enquiries.filter((e) => e.status === 'New').length
  const side = (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Admin">
      <p className="mb-4 px-3 font-display text-lg text-white">{settings.companyName}<span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Admin panel</span></p>
      {items.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10'}`}>
          <Icon size={18} />{label}{label === 'Enquiries' && fresh > 0 && <span className="ml-auto rounded-full bg-saffron px-2 text-xs">{fresh}</span>}
        </NavLink>
      ))}
      <div className="mt-auto space-y-1 pt-4">
        <Link to="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10"><ExternalLink size={18} />View website</Link>
        <button onClick={() => { logoutAdmin(); nav('/admin/login') }} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10"><LogOut size={18} />Log out</button>
      </div>
    </nav>
  )
  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-forest-deep lg:block">{side}</aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-forest-deep px-4 py-3 text-white lg:hidden">
        <span className="font-display">Admin panel</span>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="flex h-11 w-11 items-center justify-center">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="fixed inset-x-0 top-[60px] bottom-0 z-20 overflow-auto bg-forest-deep lg:hidden">{side}</div>}
      <main className="min-w-0 p-4 md:p-8">
        <p className="mb-6 rounded-lg bg-gold/15 px-4 py-2 text-xs text-ink">Demo mode: all data lives in this browser's localStorage. It is not shared with other devices and the admin password is not server-side security. Connect a real backend before going live.</p>
        <Outlet />
      </main>
    </div>
  )
}
