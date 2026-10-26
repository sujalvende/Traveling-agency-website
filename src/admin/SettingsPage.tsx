import { useState } from 'react'
import { useData, update, changeAdminPassword, resetToDemo } from '../lib/store'
import type { Settings, Testimonial } from '../lib/types'
import { AddBtn, Confirm, Field, ImageInput, RowTools, moveItem, useToast } from './ui'
import { uid } from '../lib/utils'

export default function SettingsPage() {
  const d = useData()
  const [s, setS] = useState<Settings>(d.settings)
  const [tm, setTm] = useState<Testimonial[]>(d.testimonials)
  const [cur, setCur] = useState('')
  const [nw, setNw] = useState('')
  const [reset, setReset] = useState(false)
  const { toast, show } = useToast()
  const f = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setS({ ...s, [k]: e.target.value })

  function save() {
    if (!s.companyName.trim()) return show('Company name is required', 'err')
    if (s.whatsapp && s.whatsapp.replace(/\D/g, '').length < 10) return show('WhatsApp number looks too short (include country code, e.g. 919876543210)', 'err')
    const r = update((x) => ({ ...x, settings: s, testimonials: tm }))
    show(r.ok ? 'Settings saved' : r.error!, r.ok ? 'ok' : 'err')
  }
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-3xl text-forest">Company settings</h1><button className="btn btn-primary btn-sm" onClick={save}>Save settings</button></div>
      <section className="card space-y-4 p-5"><h2 className="text-xl text-forest">Brand</h2>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Company name"><input className="field" value={s.companyName} onChange={f('companyName')} /></Field><Field label="Tagline"><input className="field" value={s.tagline} onChange={f('tagline')} /></Field></div>
        <ImageInput label="Logo" value={s.logo} onChange={(v) => setS({ ...s, logo: v })} />
        <ImageInput label="Homepage hero photograph" value={s.heroImage} onChange={(v) => setS({ ...s, heroImage: v })} />
        <Field label="Business description"><textarea rows={4} className="field" value={s.description} onChange={f('description')} /></Field>
        <Field label="Footer text"><input className="field" value={s.footerText} onChange={f('footerText')} /></Field>
        <Field label="Default currency"><input className="field" value="INR (₹)" disabled /></Field>
      </section>
      <section className="card space-y-4 p-5"><h2 className="text-xl text-forest">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone"><input className="field" value={s.phone} onChange={f('phone')} /></Field>
          <Field label="WhatsApp number" hint="With country code, digits only, e.g. 919876543210"><input className="field" value={s.whatsapp} onChange={f('whatsapp')} /></Field>
          <Field label="Email"><input type="email" className="field" value={s.email} onChange={f('email')} /></Field>
        </div>
        <Field label="Office address"><textarea rows={2} className="field" value={s.address} onChange={f('address')} /></Field>
        <div className="grid gap-4 sm:grid-cols-3">{(['facebook', 'instagram', 'youtube'] as const).map((k) => <Field key={k} label={`${k[0].toUpperCase() + k.slice(1)} URL`}><input className="field" value={s.social[k]} onChange={(e) => setS({ ...s, social: { ...s.social, [k]: e.target.value } })} /></Field>)}</div>
      </section>
      <section className="card space-y-4 p-5"><h2 className="text-xl text-forest">Why choose us</h2>
        {s.strengths.map((x, i) => (
          <div key={x.id} className="space-y-2 rounded-xl border border-line p-3">
            <input aria-label="Title" className="field" value={x.title} onChange={(e) => setS({ ...s, strengths: s.strengths.map((y, j) => (j === i ? { ...y, title: e.target.value } : y)) })} />
            <textarea aria-label="Text" rows={2} className="field" value={x.text} onChange={(e) => setS({ ...s, strengths: s.strengths.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)) })} />
            <RowTools i={i} n={s.strengths.length} move={(a, b) => setS({ ...s, strengths: moveItem(s.strengths, a, b) })} remove={() => setS({ ...s, strengths: s.strengths.filter((_, j) => j !== i) })} />
          </div>))}
        <AddBtn onClick={() => setS({ ...s, strengths: [...s.strengths, { id: uid('s'), title: '', text: '' }] })}>Add strength</AddBtn>
      </section>
      <section className="card space-y-4 p-5"><h2 className="text-xl text-forest">Testimonials</h2>
        <p className="text-sm text-muted">Only add testimonials supplied by real customers. Tick “demo” for sample text.</p>
        {tm.map((x, i) => (
          <div key={x.id} className="space-y-2 rounded-xl border border-line p-3">
            <div className="grid gap-2 sm:grid-cols-2"><input aria-label="Name" placeholder="Name" className="field" value={x.name} onChange={(e) => setTm(tm.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} /><input aria-label="Place" placeholder="Place" className="field" value={x.place} onChange={(e) => setTm(tm.map((y, j) => (j === i ? { ...y, place: e.target.value } : y)))} /></div>
            <textarea aria-label="Testimonial" rows={2} className="field" value={x.text} onChange={(e) => setTm(tm.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={x.isDemo} onChange={(e) => setTm(tm.map((y, j) => (j === i ? { ...y, isDemo: e.target.checked } : y)))} />Demo content</label>
            <RowTools i={i} n={tm.length} move={(a, b) => setTm(moveItem(tm, a, b))} remove={() => setTm(tm.filter((_, j) => j !== i))} />
          </div>))}
        <AddBtn onClick={() => setTm([...tm, { id: uid('t'), name: '', place: '', text: '', isDemo: false }])}>Add testimonial</AddBtn>
      </section>
      <section className="card space-y-4 p-5"><h2 className="text-xl text-forest">Security & data</h2>
        <div className="grid gap-3 sm:grid-cols-2"><Field label="Current password"><input type="password" className="field" value={cur} onChange={(e) => setCur(e.target.value)} /></Field><Field label="New password (min 8)"><input type="password" className="field" value={nw} onChange={(e) => setNw(e.target.value)} /></Field></div>
        <button className="btn btn-outline btn-sm" onClick={async () => { if (nw.length < 8) return show('New password needs 8+ characters', 'err'); const ok = await changeAdminPassword(cur, nw); show(ok ? 'Password changed' : 'Current password is wrong', ok ? 'ok' : 'err'); setCur(''); setNw('') }}>Change password</button>
        <button className="btn btn-sm border border-red-300 text-red-700" onClick={() => setReset(true)}>Reset all data to demo content</button>
      </section>
      {reset && <Confirm text="Erase everything (tours, enquiries, settings) and restore demo content?" onNo={() => setReset(false)} onYes={() => { resetToDemo(); setReset(false); location.reload() }} />}
      {toast}
    </div>
  )
}
