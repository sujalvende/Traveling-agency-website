import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { useData, update } from '../lib/store'
import { pricingModeLabel } from '../lib/pricing'
import { slugify, uid } from '../lib/utils'
import type { Tour, Stop, VehicleRate } from '../lib/types'
import { AddBtn, Confirm, Field, ImageInput, RowTools, moveItem, useToast } from './ui'
import { DemoTag } from '../components/Common'

export function ToursList() {
  const { tours } = useData()
  const [del, setDel] = useState<Tour | null>(null)
  const { toast, show } = useToast()
  const toggle = (id: string, k: 'published' | 'featured') => update((d) => ({ ...d, tours: d.tours.map((t) => (t.id === id ? { ...t, [k]: !t[k], updatedAt: new Date().toISOString() } : t)) }))
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl text-forest">Tours</h1><Link to="/admin/tours/new" className="btn btn-saffron btn-sm"><Plus size={16} />New tour</Link></div>
      <div className="space-y-3">
        {tours.length === 0 && <p className="card p-6 text-muted">No tours yet. Create your first package.</p>}
        {tours.map((t) => (
          <div key={t.id} className="card flex flex-wrap items-center gap-4 p-4">
            <img src={t.cover} alt="" className="h-16 w-24 rounded-lg bg-sand object-cover" />
            <div className="min-w-0 flex-1 basis-60">
              <p className="font-semibold text-forest">{t.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className={`rounded-full px-2 py-0.5 font-bold ${t.published ? 'bg-forest/10 text-forest' : 'bg-sand text-muted'}`}>{t.published ? 'Published' : 'Draft'}</span>
                {t.featured && <span className="rounded-full bg-saffron/15 px-2 py-0.5 font-bold text-saffron-deep">Featured</span>}
                {pricingModeLabel[t.pricing.mode]} · {t.durationLabel}<DemoTag show={t.isDemo} />
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button className="btn btn-outline btn-sm" onClick={() => { toggle(t.id, 'published'); show(t.published ? 'Unpublished' : 'Published') }}>{t.published ? <EyeOff size={14} /> : <Eye size={14} />}{t.published ? 'Unpublish' : 'Publish'}</button>
              <button className="btn btn-outline btn-sm" aria-label="Toggle featured" onClick={() => toggle(t.id, 'featured')}><Star size={14} className={t.featured ? 'fill-saffron text-saffron' : ''} /></button>
              <Link to={`/tours/${t.slug}?preview=1`} target="_blank" className="btn btn-outline btn-sm">Preview</Link>
              <Link to={`/admin/tours/${t.id}`} className="btn btn-primary btn-sm"><Pencil size={14} />Edit</Link>
              <button className="btn btn-outline btn-sm !border-red-300 !text-red-700" aria-label="Delete" onClick={() => setDel(t)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {del && <Confirm text={`Delete "${del.title}"? Its enquiries stay, but the tour link will stop working.`} onNo={() => setDel(null)} onYes={() => {
        update((d) => ({ ...d, tours: d.tours.filter((t) => t.id !== del.id), gallery: d.gallery.map((g) => (g.tourId === del.id ? { ...g, tourId: null } : g)) }))
        setDel(null); show('Tour deleted')
      }} />}
      {toast}
    </div>
  )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="card space-y-4 p-5"><h2 className="text-xl text-forest">{title}</h2>{children}</section>

const blank = (): Tour => ({
  id: uid('tour'), title: '', slug: '', shortDescription: '', description: '', cover: '', categoryIds: [], durationLabel: '1 Day', durationDays: 1,
  departureInfo: '', published: false, featured: false, inclusions: [], exclusions: [], travelInfo: [], faqs: [],
  pricing: { mode: 'custom', currency: 'INR', perPerson: null, minGroup: null, maxGroup: null, perPersonExtra: null, conditions: '', additionalCharges: '', vehicles: [], isDemo: false },
  stops: [], gallery: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isDemo: false,
})
const num = (v: string) => (v === '' ? null : Math.max(0, Number(v)))
const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean)

export function TourEditor() {
  const { id } = useParams()
  const data = useData()
  const nav = useNavigate()
  const existing = data.tours.find((t) => t.id === id)
  const [t, setT] = useState<Tour>(() => existing ?? blank())
  const [slugTouched, setSlugTouched] = useState(!!existing)
  const [errs, setErrs] = useState<string[]>([])
  const { toast, show } = useToast()
  if (id && id !== 'new' && !existing) return <p className="card p-6">Tour not found. <Link to="/admin/tours" className="underline">Back</Link></p>

  const p = t.pricing
  const setP = (patch: Partial<Tour['pricing']>) => setT({ ...t, pricing: { ...p, ...patch } })
  const setStop = (i: number, patch: Partial<Stop>) => setT({ ...t, stops: t.stops.map((s, j) => (j === i ? { ...s, ...patch } : s)) })
  const setVeh = (i: number, patch: Partial<VehicleRate>) => setP({ vehicles: p.vehicles.map((v, j) => (j === i ? { ...v, ...patch } : v)) })

  function save(publish?: boolean) {
    const e: string[] = []
    if (!t.title.trim()) e.push('Title is required.')
    const slug = t.slug || slugify(t.title)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) e.push('Slug may only contain lowercase letters, numbers and hyphens.')
    if (data.tours.some((x) => x.slug === slug && x.id !== t.id)) e.push('Another tour already uses this slug.')
    if (!t.cover) e.push('Add a cover image.')
    const wantPublish = publish ?? t.published
    if (wantPublish && !t.shortDescription.trim()) e.push('Add a short description before publishing.')
    if (p.mode === 'per_person' && p.minGroup && p.maxGroup && p.minGroup > p.maxGroup) e.push('Minimum group size cannot exceed maximum.')
    setErrs(e)
    if (e.length) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const next: Tour = { ...t, slug, published: wantPublish, durationDays: Math.max(1, t.durationDays), isDemo: existing ? t.isDemo : false, updatedAt: new Date().toISOString(), pricing: { ...p, isDemo: p.isDemo } }
    const r = update((d) => ({ ...d, tours: existing ? d.tours.map((x) => (x.id === t.id ? next : x)) : [...d.tours, next] }))
    if (!r.ok) { show(r.error ?? 'Could not save', 'err'); return }
    show(wantPublish ? 'Saved & published' : 'Saved as draft')
    if (!existing) nav(`/admin/tours/${t.id}`, { replace: true })
    else setT(next)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl text-forest">{existing ? 'Edit tour' : 'New tour'}</h1><Link to="/admin/tours" className="text-sm underline">Back to tours</Link></div>
      {errs.length > 0 && <ul role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{errs.map((x) => <li key={x}>• {x}</li>)}</ul>}

      <Section title="Basics">
        <Field label="Title *"><input className="field" value={t.title} onChange={(e) => setT({ ...t, title: e.target.value, slug: slugTouched ? t.slug : slugify(e.target.value) })} /></Field>
        <Field label="URL slug" hint={`/tours/${t.slug || '…'}`}><input className="field" value={t.slug} onChange={(e) => { setSlugTouched(true); setT({ ...t, slug: slugify(e.target.value) }) }} /></Field>
        <Field label="Short description"><textarea rows={2} className="field" value={t.shortDescription} onChange={(e) => setT({ ...t, shortDescription: e.target.value })} /></Field>
        <Field label="Detailed description"><textarea rows={5} className="field" value={t.description} onChange={(e) => setT({ ...t, description: e.target.value })} /></Field>
        <ImageInput label="Cover image *" value={t.cover} onChange={(v) => setT({ ...t, cover: v })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Duration label"><input className="field" value={t.durationLabel} onChange={(e) => setT({ ...t, durationLabel: e.target.value })} placeholder="3 Days / 2 Nights" /></Field>
          <Field label="Number of days"><input type="number" min={1} className="field" value={t.durationDays} onChange={(e) => setT({ ...t, durationDays: Number(e.target.value) })} /></Field>
          <Field label="Departure info"><input className="field" value={t.departureInfo} onChange={(e) => setT({ ...t, departureInfo: e.target.value })} /></Field>
        </div>
        <fieldset><legend className="label">Categories</legend><div className="flex flex-wrap gap-2">{data.categories.map((c) => (
          <label key={c.id} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${t.categoryIds.includes(c.id) ? 'border-forest bg-forest text-white' : 'border-line'}`}>
            <input type="checkbox" className="sr-only" checked={t.categoryIds.includes(c.id)} onChange={() => setT({ ...t, categoryIds: t.categoryIds.includes(c.id) ? t.categoryIds.filter((x) => x !== c.id) : [...t.categoryIds, c.id] })} />{c.name}</label>))}</div></fieldset>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.featured} onChange={(e) => setT({ ...t, featured: e.target.checked })} />Featured on homepage</label>
      </Section>

      <Section title="Pricing">
        <Field label="Pricing mode"><select className="field" value={p.mode} onChange={(e) => setP({ mode: e.target.value as Tour['pricing']['mode'] })}><option value="per_person">Per person</option><option value="per_vehicle">Per vehicle</option><option value="custom">Custom quote</option></select></Field>
        {p.mode === 'per_person' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price per person (₹)" hint="Leave blank to show “Contact for Pricing”"><input type="number" min={0} className="field" value={p.perPerson ?? ''} onChange={(e) => setP({ perPerson: num(e.target.value) })} /></Field>
            <Field label="Additional charge (₹, flat)"><input type="number" min={0} className="field" value={p.perPersonExtra ?? ''} onChange={(e) => setP({ perPersonExtra: num(e.target.value) })} /></Field>
            <Field label="Minimum group size"><input type="number" min={0} className="field" value={p.minGroup ?? ''} onChange={(e) => setP({ minGroup: num(e.target.value) })} /></Field>
            <Field label="Maximum group size"><input type="number" min={0} className="field" value={p.maxGroup ?? ''} onChange={(e) => setP({ maxGroup: num(e.target.value) })} /></Field>
          </div>
        )}
        {p.mode === 'per_vehicle' && (
          <div className="space-y-3">
            {p.vehicles.map((v, i) => (
              <div key={v.id} className="space-y-3 rounded-xl border border-line p-4">
                <div className="grid gap-3 sm:grid-cols-4">
                  <Field label="Vehicle type"><input className="field" value={v.type} onChange={(e) => setVeh(i, { type: e.target.value })} placeholder="Sedan / Innova / Tempo Traveller" /></Field>
                  <Field label="Seats"><input type="number" min={1} className="field" value={v.seats} onChange={(e) => setVeh(i, { seats: Number(e.target.value) })} /></Field>
                  <Field label="Package price (₹)"><input type="number" min={0} className="field" value={v.price ?? ''} onChange={(e) => setVeh(i, { price: num(e.target.value) })} /></Field>
                  <Field label="Additional charge (₹)"><input type="number" min={0} className="field" value={v.extraCharge ?? ''} onChange={(e) => setVeh(i, { extraCharge: num(e.target.value) })} /></Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Distance / duration conditions"><input className="field" value={v.conditions} onChange={(e) => setVeh(i, { conditions: e.target.value })} /></Field>
                  <Field label="Included services"><input className="field" value={v.included} onChange={(e) => setVeh(i, { included: e.target.value })} /></Field>
                  <Field label="Notes"><input className="field" value={v.notes} onChange={(e) => setVeh(i, { notes: e.target.value })} /></Field>
                </div>
                <RowTools i={i} n={p.vehicles.length} move={(a, b) => setP({ vehicles: moveItem(p.vehicles, a, b) })} remove={() => setP({ vehicles: p.vehicles.filter((_, j) => j !== i) })} />
              </div>
            ))}
            <AddBtn onClick={() => setP({ vehicles: [...p.vehicles, { id: uid('veh'), type: '', seats: 4, price: null, extraCharge: null, conditions: '', included: 'Vehicle and driver', notes: '' }] })}>Add vehicle</AddBtn>
          </div>
        )}
        {p.mode !== 'custom' && <>
          <Field label="Pricing conditions"><textarea rows={2} className="field" value={p.conditions} onChange={(e) => setP({ conditions: e.target.value })} /></Field>
          <Field label="Additional charges (text)"><textarea rows={2} className="field" value={p.additionalCharges} onChange={(e) => setP({ additionalCharges: e.target.value })} /></Field>
        </>}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.isDemo} onChange={(e) => setP({ isDemo: e.target.checked })} />Mark these prices as demo data (shows a “Demo data” label)</label>
      </Section>

      <Section title="Route & itinerary">
        {t.stops.map((s, i) => (
          <div key={s.id} className="space-y-3 rounded-xl border border-line p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-deep">Stop {i + 1}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Destination"><select className="field" value={s.destinationId ?? ''} onChange={(e) => { const dst = data.destinations.find((x) => x.id === e.target.value); setStop(i, dst ? { destinationId: dst.id, name: s.name || dst.name, image: s.image || dst.image } : { destinationId: null }) }}><option value="">Custom stop</option>{data.destinations.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
              <Field label="Stop name"><input className="field" value={s.name} onChange={(e) => setStop(i, { name: e.target.value })} /></Field>
              <Field label="Day"><input type="number" min={1} className="field" value={s.day} onChange={(e) => setStop(i, { day: Math.max(1, Number(e.target.value)) })} /></Field>
              <Field label="Planned visit duration"><input className="field" value={s.duration} onChange={(e) => setStop(i, { duration: e.target.value })} placeholder="2 hours" /></Field>
              <Field label="Arrival / departure info"><input className="field" value={s.timing} onChange={(e) => setStop(i, { timing: e.target.value })} /></Field>
              <Field label="Traveller notes"><input className="field" value={s.notes} onChange={(e) => setStop(i, { notes: e.target.value })} /></Field>
            </div>
            <Field label="Description"><textarea rows={2} className="field" value={s.description} onChange={(e) => setStop(i, { description: e.target.value })} /></Field>
            <ImageInput label="Stop photograph" value={s.image} onChange={(v) => setStop(i, { image: v })} />
            <RowTools i={i} n={t.stops.length} move={(a, b) => setT({ ...t, stops: moveItem(t.stops, a, b) })} remove={() => setT({ ...t, stops: t.stops.filter((_, j) => j !== i) })} />
          </div>
        ))}
        <AddBtn onClick={() => setT({ ...t, stops: [...t.stops, { id: uid('stop'), name: '', destinationId: null, description: '', image: '', day: t.stops.at(-1)?.day ?? 1, duration: '', timing: '', notes: '' }] })}>Add stop</AddBtn>
      </Section>

      <Section title="Details">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Inclusions (one per line)"><textarea rows={5} className="field" value={t.inclusions.join('\n')} onChange={(e) => setT({ ...t, inclusions: lines(e.target.value) })} /></Field>
          <Field label="Exclusions (one per line)"><textarea rows={5} className="field" value={t.exclusions.join('\n')} onChange={(e) => setT({ ...t, exclusions: lines(e.target.value) })} /></Field>
          <Field label="Travel information (one per line)"><textarea rows={5} className="field" value={t.travelInfo.join('\n')} onChange={(e) => setT({ ...t, travelInfo: lines(e.target.value) })} /></Field>
        </div>
        <div className="space-y-3"><p className="label">FAQs</p>
          {t.faqs.map((f, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-line p-3">
              <input className="field" placeholder="Question" value={f.q} onChange={(e) => setT({ ...t, faqs: t.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} />
              <textarea rows={2} className="field" placeholder="Answer" value={f.a} onChange={(e) => setT({ ...t, faqs: t.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} />
              <RowTools i={i} n={t.faqs.length} move={(a, b) => setT({ ...t, faqs: moveItem(t.faqs, a, b) })} remove={() => setT({ ...t, faqs: t.faqs.filter((_, j) => j !== i) })} />
            </div>))}
          <AddBtn onClick={() => setT({ ...t, faqs: [...t.faqs, { q: '', a: '' }] })}>Add FAQ</AddBtn></div>
      </Section>

      <Section title="Gallery images">
        {t.gallery.map((g, i) => (
          <div key={g.id} className="space-y-2 rounded-xl border border-line p-3">
            <ImageInput value={g.src} onChange={(v) => setT({ ...t, gallery: t.gallery.map((x, j) => (j === i ? { ...x, src: v } : x)) })} />
            <input className="field" placeholder="Caption" value={g.caption} onChange={(e) => setT({ ...t, gallery: t.gallery.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)) })} />
            <RowTools i={i} n={t.gallery.length} move={(a, b) => setT({ ...t, gallery: moveItem(t.gallery, a, b) })} remove={() => setT({ ...t, gallery: t.gallery.filter((_, j) => j !== i) })} />
          </div>))}
        <AddBtn onClick={() => setT({ ...t, gallery: [...t.gallery, { id: uid('img'), src: '', caption: '' }] })}>Add image</AddBtn>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-3 border-t border-line bg-ivory/95 p-4 backdrop-blur md:-mx-8 md:px-8">
        <button className="btn btn-outline" onClick={() => save(false)}>Save as draft</button>
        <button className="btn btn-primary" onClick={() => save(true)}>Save & publish</button>
        {existing && <button className="btn btn-outline" onClick={() => save()}>Save changes</button>}
      </div>
      {toast}
    </div>
  )
}
