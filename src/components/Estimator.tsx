import { useState } from 'react'
import { Calculator, AlertTriangle } from 'lucide-react'
import type { Tour } from '../lib/types'
import { estimate, inr } from '../lib/pricing'

export default function Estimator({ tour }: { tour: Tour }) {
  const [n, setN] = useState('2')
  const [veh, setVeh] = useState('')
  const [from, setFrom] = useState('')
  const [date, setDate] = useState('')
  const est = estimate(tour, Number(n), veh)
  return (
    <div className="card p-5">
      <h3 className="flex items-center gap-2 text-lg text-forest"><Calculator size={18} />Estimate your cost</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor="es-from">Departure city</label><input id="es-from" className="field" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="label" htmlFor="es-date">Preferred date</label><input id="es-date" type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="label" htmlFor="es-n">Travellers</label><input id="es-n" type="number" min={1} className="field" value={n} onChange={(e) => setN(e.target.value)} /></div>
        {tour.pricing.mode === 'per_vehicle' && (
          <div><label className="label" htmlFor="es-v">Vehicle</label>
            <select id="es-v" className="field" value={veh} onChange={(e) => setVeh(e.target.value)}>
              <option value="">Select vehicle</option>
              {tour.pricing.vehicles.map((v) => <option key={v.id} value={v.id}>{v.type} ({v.seats} seats)</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-sand p-4" aria-live="polite">
        {est.ok ? (<>
          <ul className="space-y-1 text-sm">{est.lines.map((l) => <li key={l.label} className="flex justify-between gap-4"><span>{l.label}</span><span>{inr(l.value)}</span></li>)}</ul>
          <p className="mt-3 flex justify-between border-t border-line pt-3 font-display text-xl text-forest"><span>Estimated total</span><span>{inr(est.total)}</span></p>
          {est.warnings.map((w) => <p key={w} className="mt-2 flex gap-2 text-xs text-saffron-deep"><AlertTriangle size={14} className="shrink-0" />{w}</p>)}
          {tour.pricing.mode === 'per_vehicle' && <p className="mt-2 text-xs text-muted">Vehicle packages are a flat rate and are not multiplied by the number of travellers.</p>}
          <p className="mt-2 text-xs text-muted">This is an estimate only. Final price, date, vehicle availability and extra services are confirmed by our team.{tour.pricing.isDemo && ' Prices shown are demo data.'}</p>
        </>) : <p className="text-sm text-muted">{est.reason}</p>}
      </div>
    </div>
  )
}
