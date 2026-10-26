import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Compass, MessageCircle } from 'lucide-react'
import type { Settings } from '../lib/types'

export function useTitle(title: string, desc?: string) {
  useEffect(() => {
    document.title = title
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m) }
    if (desc) m.setAttribute('content', desc)
  }, [title, desc])
}

export function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading')
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      {state !== 'err' && (
        <img src={src} alt={alt} loading="lazy" onLoad={() => setState('ok')} onError={() => setState('err')}
          className={`h-full w-full object-cover transition-opacity duration-500 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`} />
      )}
      {state === 'err' && <div className="flex h-full w-full items-center justify-center text-xs text-muted">Image unavailable</div>}
    </div>
  )
}

export function Logo({ s, light = false }: { s: Settings; light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      {s.logo ? (
        <img src={s.logo} alt={`${s.companyName} logo`} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${light ? 'bg-white/15 text-white' : 'bg-forest text-ivory'}`}><Compass size={20} /></span>
      )}
      <span className="leading-tight">
        <span className={`block font-display text-lg font-semibold ${light ? 'text-white' : 'text-forest'}`}>{s.companyName}</span>
        <span className={`block text-[11px] uppercase tracking-[0.18em] ${light ? 'text-white/70' : 'text-muted'}`}>{s.tagline}</span>
      </span>
    </span>
  )
}

export function SectionHead({ eyebrow, title, children, action }: { eyebrow: string; title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="text-3xl font-semibold text-forest md:text-4xl">{title}</h2>
        {children && <p className="mt-3 text-muted">{children}</p>}
      </div>
      {action}
    </div>
  )
}

export function DemoTag({ show }: { show: boolean }) {
  return show ? <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">Demo data</span> : null
}

export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25a244] text-white shadow-lg transition hover:scale-105">
      <MessageCircle size={22} />
    </a>
  )
}

export function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <h3 className="text-xl text-forest">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export const BackLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="text-sm font-semibold text-forest underline-offset-4 hover:underline">{children}</Link>
)
