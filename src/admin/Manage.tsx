import { useState } from 'react'
import { Trash2, MessageCircle, Search } from 'lucide-react'
import { useData, update } from '../lib/store'
import type { Category, Destination, EnquiryStatus, GalleryImage } from '../lib/types'
import { ENQUIRY_STATUSES } from '../lib/types'
import { slugify, uid, waLink, fmtDate } from '../lib/utils'
import { AddBtn, Confirm, Field, ImageInput, RowTools, moveItem, useToast } from './ui'

export function DestinationsAdmin() {
  const { destinations, tours } = useData()
  const [list, setList] = useState<Destination[]>(() => [...destinations].sort((a, b) => a.order - b.order))
  const [del, setDel] = useState<number | null>(null)
  const { toast, show } = useToast()
  const patch = (i: number, p: Partial<Destination>) => setList(list.map((x, j) => (j === i ? { ...x, ...p } : x)))
  function save() {
    const slugs = list.map((x) => x.slug)
    if (list.some((x) => !x.name.trim())) return show('Every destination needs a name', 'err')
    if (new Set(slugs).size !== slugs.length) return show('Destination slugs must be unique', 'err')
    const r = update((d) => ({ ...d, destinations: list.map((x, i) => ({ ...x, slug: x.slug || slugify(x.name), order: i })) }))
    show(r.ok ? 'Destinations saved' : r.error!, r.ok ? 'ok' : 'err')
  }
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl text-forest">Destinations</h1><div className="flex gap-2"><AddBtn onClick={() => setList([...list, { id: uid('dest'), name: '', slug: '', description: '', image: '', lat: null, lng: null, order: list.length }])}>Add</AddBtn><button className="btn btn-primary btn-sm" onClick={save}>Save all</button></div></div>
      {list.map((x, i) => {
        const used = tours.filter((t) => t.stops.some((s) => s.destinationId === x.id))
        return (
          <div key={x.id} className="card space-y-3 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><input className="field" value={x.name} onChange={(e) => patch(i, { name: e.target.value, slug: slugify(e.target.value) })} /></Field>
              <Field label="Slug"><input className="field" value={x.slug} onChange={(e) => patch(i, { slug: slugify(e.target.value) })} /></Field>
            </div>
            <Field label="Description"><textarea rows={2} className="field" value={x.description} onChange={(e) => patch(i, { description: e.target.value })} /></Field>
            <ImageInput value={x.image} onChange={(v) => patch(i, { image: v })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Latitude (optional)"><input type="number" step="any" className="field" value={x.lat ?? ''} onChange={(e) => patch(i, { lat: e.target.value === '' ? null : Number(e.target.value) })} /></Field>
              <Field label="Longitude (optional)"><input type="number" step="any" className="field" value={x.lng ?? ''} onChange={(e) => patch(i, { lng: e.target.value === '' ? null : Number(e.target.value) })} /></Field>
            </div>
            <p className="text-xs text-muted">Used in {used.length} tour(s){used.length ? ': ' + used.map((t) => t.title).join(', ') : ''}</p>
            <RowTools i={i} n={list.length} move={(a, b) => setList(moveItem(list, a, b))} remove={() => setDel(i)} />
          </div>
        )
      })}
      {del !== null && <Confirm text={`Delete "${list[del].name || 'this destination'}"? Tour stops keep their names but lose the link. Click "Save all" afterwards to apply.`} onNo={() => setDel(null)} onYes={() => { setList(list.filter((_, j) => j !== del)); setDel(null) }} />}
      {toast}
    </div>
  )
}

export function CategoriesAdmin() {
  const { categories, tours } = useData()
  const [list, setList] = useState<Category[]>(categories)
  const { toast, show } = useToast()
  const patch = (i: number, p: Partial<Category>) => setList(list.map((x, j) => (j === i ? { ...x, ...p } : x)))
  function save() {
    if (list.some((c) => !c.name.trim())) return show('Every category needs a name', 'err')
    const removed = categories.filter((c) => !list.some((x) => x.id === c.id)).map((c) => c.id)
    const r = update((d) => ({ ...d, categories: list.map((c) => ({ ...c, slug: c.slug || slugify(c.name) })), tours: d.tours.map((t) => ({ ...t, categoryIds: t.categoryIds.filter((c) => !removed.includes(c)) })) }))
    show(r.ok ? 'Categories saved' : r.error!, r.ok ? 'ok' : 'err')
  }
  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl text-forest">Categories</h1><div className="flex gap-2"><AddBtn onClick={() => setList([...list, { id: uid('cat'), name: '', slug: '', description: '' }])}>Add</AddBtn><button className="btn btn-primary btn-sm" onClick={save}>Save all</button></div></div>
      <p className="text-sm text-muted">Assign categories to tours from the tour editor.</p>
      {list.map((c, i) => (
        <div key={c.id} className="card grid items-end gap-3 p-4 sm:grid-cols-[1fr_1.5fr_auto]">
          <Field label="Name"><input className="field" value={c.name} onChange={(e) => patch(i, { name: e.target.value, slug: slugify(e.target.value) })} /></Field>
          <Field label={`Description · ${tours.filter((t) => t.categoryIds.includes(c.id)).length} tours`}><input className="field" value={c.description} onChange={(e) => patch(i, { description: e.target.value })} /></Field>
          <RowTools i={i} n={list.length} move={(a, b) => setList(moveItem(list, a, b))} remove={() => setList(list.filter((_, j) => j !== i))} />
        </div>
      ))}
      {toast}
    </div>
  )
}

export function GalleryAdmin() {
  const { gallery, destinations, tours, categories } = useData()
  const [list, setList] = useState<GalleryImage[]>(gallery)
  const { toast, show } = useToast()
  const patch = (i: number, p: Partial<GalleryImage>) => setList(list.map((x, j) => (j === i ? { ...x, ...p } : x)))
  function save() {
    if (list.some((g) => !g.src)) return show('Every item needs an image', 'err')
    const r = update((d) => ({ ...d, gallery: list }))
    show(r.ok ? 'Gallery saved' : r.error!, r.ok ? 'ok' : 'err')
  }
  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl text-forest">Gallery</h1><div className="flex gap-2"><AddBtn onClick={() => setList([...list, { id: uid('g'), src: '', caption: '', destinationId: null, tourId: null, categoryId: null }])}>Add image</AddBtn><button className="btn btn-primary btn-sm" onClick={save}>Save all</button></div></div>
      {list.map((g, i) => (
        <div key={g.id} className="card space-y-3 p-4">
          <ImageInput value={g.src} onChange={(v) => patch(i, { src: v })} label="Image (upload to replace)" />
          <Field label="Caption"><input className="field" value={g.caption} onChange={(e) => patch(i, { caption: e.target.value })} /></Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <select aria-label="Destination" className="field" value={g.destinationId ?? ''} onChange={(e) => patch(i, { destinationId: e.target.value || null })}><option value="">No destination</option>{destinations.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
            <select aria-label="Tour" className="field" value={g.tourId ?? ''} onChange={(e) => patch(i, { tourId: e.target.value || null })}><option value="">No tour</option>{tours.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</select>
            <select aria-label="Category" className="field" value={g.categoryId ?? ''} onChange={(e) => patch(i, { categoryId: e.target.value || null })}><option value="">No category</option>{categories.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
          </div>
          <RowTools i={i} n={list.length} move={(a, b) => setList(moveItem(list, a, b))} remove={() => setList(list.filter((_, j) => j !== i))} />
        </div>
      ))}
      {toast}
    </div>
  )
}

export function EnquiriesAdmin() {
  const { enquiries, settings } = useData()
  const [q, setQ] = useState('')
  const [st, setSt] = useState('')
  const [del, setDel] = useState<string | null>(null)
  const set = (id: string, p: object) => update((d) => ({ ...d, enquiries: d.enquiries.map((e) => (e.id === id ? { ...e, ...p } : e)) }))
  const list = enquiries.filter((e) => (!st || e.status === st) && (e.name + e.mobile + e.tourTitle).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-5">
      <h1 className="text-3xl text-forest">Enquiries</h1>
      <p className="text-sm text-muted">Status describes the enquiry workflow only. “Confirmed” does not create a booking.</p>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input aria-label="Search enquiries" className="field !pl-9" placeholder="Search name, mobile or tour" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select aria-label="Status filter" className="field !w-auto" value={st} onChange={(e) => setSt(e.target.value)}><option value="">All statuses</option>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {list.length === 0 && <p className="card p-6 text-muted">{enquiries.length ? 'No enquiries match.' : 'No enquiries yet. They will appear here when customers submit the form.'}</p>}
      <div className="space-y-3">
        {list.map((e) => (
          <div key={e.id} className="card grid gap-4 p-4 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div className="text-sm">
              <p className="text-base font-semibold text-forest">{e.name}</p>
              <p>{e.mobile}{e.email && ` · ${e.email}`}</p>
              <p className="mt-1 text-muted">{e.tourTitle}</p>
              <p className="text-muted">{e.travelDate ? `Travel: ${fmtDate(e.travelDate)} · ` : ''}{e.travellers} travellers{e.vehicle && ` · ${e.vehicle}`}{e.pricingPreference && ` · ${e.pricingPreference}`}</p>
              {e.requirements && <p className="mt-1 rounded bg-sand p-2 text-xs">{e.requirements}</p>}
              <p className="mt-1 text-xs text-muted">Received {fmtDate(e.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <select aria-label="Status" className="field" value={e.status} onChange={(ev) => set(e.id, { status: ev.target.value as EnquiryStatus })}>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              <a className="btn btn-outline btn-sm w-full" target="_blank" rel="noreferrer" href={waLink({ ...settings, whatsapp: e.mobile.replace(/\D/g, '').length === 10 ? '91' + e.mobile.replace(/\D/g, '') : e.mobile }, `Hello ${e.name}, thank you for your enquiry about ${e.tourTitle}.`)}><MessageCircle size={14} />WhatsApp customer</a>
              <button className="btn btn-sm w-full border border-red-300 text-red-700" onClick={() => setDel(e.id)}><Trash2 size={14} />Delete</button>
            </div>
            <textarea aria-label="Admin notes" rows={4} className="field" placeholder="Admin notes" value={e.notes} onChange={(ev) => set(e.id, { notes: ev.target.value })} />
          </div>
        ))}
      </div>
      {del && <Confirm text="Delete this enquiry permanently?" onNo={() => setDel(null)} onYes={() => { update((d) => ({ ...d, enquiries: d.enquiries.filter((x) => x.id !== del) })); setDel(null) }} />}
    </div>
  )
}
