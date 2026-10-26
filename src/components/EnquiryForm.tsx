import { useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useData, update } from '../lib/store'
import { uid, waLink } from '../lib/utils'
import type { Enquiry } from '../lib/types'

export default function EnquiryForm({ tourId = null, compact = false }: { tourId?: string | null; compact?: boolean }) {
  const { tours, settings } = useData()
  const published = tours.filter((t) => t.published)
  const [sel, setSel] = useState(tourId ?? '')
  const [f, setF] = useState({ name: '', mobile: '', email: '', date: '', travellers: '2', vehicle: '', pref: '', req: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Enquiry | null>(null)
  const [fail, setFail] = useState('')
  const tour = tours.find((t) => t.id === sel)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (f.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(f.mobile.replace(/[\s-]/g, ''))) er.mobile = 'Enter a valid 10-digit Indian mobile number.'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.'
    const t = Number(f.travellers)
    if (!Number.isInteger(t) || t < 1 || t > 200) er.travellers = 'Enter between 1 and 200 travellers.'
    setErrors(er)
    if (Object.keys(er).length) return
    const enquiry: Enquiry = {
      id: uid('enq'), name: f.name.trim().slice(0, 100), mobile: f.mobile.trim(), email: f.email.trim(), tourId: tour?.id ?? null,
      tourTitle: tour?.title ?? 'General enquiry', travelDate: f.date, travellers: t, vehicle: f.vehicle, pricingPreference: f.pref,
      requirements: f.req.trim().slice(0, 1000), status: 'New', notes: '', createdAt: new Date().toISOString(),
    }
    const r = update((d) => ({ ...d, enquiries: [enquiry, ...d.enquiries] }))
    if (!r.ok) { setFail(r.error ?? 'Could not save your enquiry.'); return }
    setFail(''); setDone(enquiry)
  }

  if (done) {
    const msg = `Hello, I just sent an enquiry on your website${done.tourId ? ` for ${done.tourTitle}` : ''}. My name is ${done.name}. Please share details.`
    return (
      <div className="card border-forest/30 bg-forest/5 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto text-forest" size={36} />
        <h3 className="mt-3 text-xl text-forest">Enquiry received</h3>
        <p className="mt-2 text-sm text-muted">Thank you, {done.name}. Our team will contact you on {done.mobile}. This is a demo build: the enquiry is saved in this browser only.</p>
        <a href={waLink(settings, msg)} target="_blank" rel="noreferrer" className="btn btn-primary mt-5">Also message us on WhatsApp</a>
      </div>
    )
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-700">{errors[k]}</p>
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {fail && <p role="alert" className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"><AlertCircle size={18} />{fail}</p>}
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div><label className="label" htmlFor="eq-name">Your name *</label><input id="eq-name" className="field" value={f.name} onChange={set('name')} autoComplete="name" />{err('name')}</div>
        <div><label className="label" htmlFor="eq-mobile">Mobile number *</label><input id="eq-mobile" className="field" inputMode="tel" value={f.mobile} onChange={set('mobile')} autoComplete="tel" placeholder="98XXXXXXXX" />{err('mobile')}</div>
        <div><label className="label" htmlFor="eq-email">Email (optional)</label><input id="eq-email" type="email" className="field" value={f.email} onChange={set('email')} />{err('email')}</div>
        <div>
          <label className="label" htmlFor="eq-tour">Tour package</label>
          <select id="eq-tour" className="field" value={sel} onChange={(e) => { setSel(e.target.value); setF({ ...f, vehicle: '' }) }}>
            <option value="">General enquiry / custom tour</option>
            {published.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div><label className="label" htmlFor="eq-date">Preferred travel date</label><input id="eq-date" type="date" className="field" value={f.date} onChange={set('date')} min={new Date().toISOString().slice(0, 10)} /></div>
        <div><label className="label" htmlFor="eq-n">Number of travellers *</label><input id="eq-n" type="number" min={1} className="field" value={f.travellers} onChange={set('travellers')} />{err('travellers')}</div>
        {tour && tour.pricing.mode === 'per_vehicle' && tour.pricing.vehicles.length > 0 && (
          <div><label className="label" htmlFor="eq-v">Preferred vehicle</label>
            <select id="eq-v" className="field" value={f.vehicle} onChange={set('vehicle')}>
              <option value="">No preference</option>
              {tour.pricing.vehicles.map((v) => <option key={v.id} value={v.type}>{v.type} ({v.seats} seats)</option>)}
            </select>
          </div>
        )}
        {(!tour || tour.pricing.mode === 'custom') && (
          <div><label className="label" htmlFor="eq-p">Pricing preference</label>
            <select id="eq-p" className="field" value={f.pref} onChange={set('pref')}>
              <option value="">No preference</option><option>Per person</option><option>Per vehicle</option>
            </select>
          </div>
        )}
      </div>
      <div><label className="label" htmlFor="eq-r">Additional requirements</label><textarea id="eq-r" rows={3} className="field" value={f.req} onChange={set('req')} placeholder="Pickup city, senior citizens, special requests…" /></div>
      <button className="btn btn-saffron w-full" type="submit">Send Enquiry</button>
      <p className="text-xs text-muted">We only use these details to respond to your enquiry. See our privacy policy.</p>
    </form>
  )
}
