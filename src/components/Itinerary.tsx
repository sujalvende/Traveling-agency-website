import type { Tour } from '../lib/types'
import { Img } from './Common'
import { Clock } from 'lucide-react'

export default function Itinerary({ tour }: { tour: Tour }) {
  const multiDay = new Set(tour.stops.map((s) => s.day)).size > 1
  const days = [...new Set(tour.stops.map((s) => s.day))].sort((a, b) => a - b)
  let counter = 0
  return (
    <div className="space-y-10">
      {days.map((day) => (
        <div key={day}>
          {multiDay && <h3 className="mb-5 font-display text-xl text-forest">Day {day}</h3>}
          <ol className="relative ml-4 border-l-2 border-dashed border-gold/50">
            {tour.stops.filter((s) => s.day === day).map((s) => {
              counter++
              return (
                <li key={s.id} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm font-bold text-ivory ring-4 ring-ivory">{counter}</span>
                  <div className="card flex flex-col gap-4 overflow-hidden sm:flex-row">
                    {s.image && <Img src={s.image} alt={s.name} className="aspect-[16/10] sm:aspect-auto sm:w-48 sm:shrink-0" />}
                    <div className="p-4 sm:py-4 sm:pl-0">
                      <h4 className="text-lg font-semibold text-forest">{s.name}</h4>
                      {(s.duration || s.timing) && <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-saffron-deep"><Clock size={13} />{[s.duration, s.timing].filter(Boolean).join(' · ')}</p>}
                      <p className="mt-2 text-sm text-muted">{s.description}</p>
                      {s.notes && <p className="mt-2 rounded-lg bg-sand px-3 py-2 text-xs text-ink">Note: {s.notes}</p>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}
