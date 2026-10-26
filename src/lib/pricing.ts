import type { Pricing, Tour, VehicleRate } from './types'

export const inr = (n: number) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)

export function priceBadge(p: Pricing): { type: string; text: string } {
  if (p.mode === 'per_person') {
    return p.perPerson ? { type: 'Per person', text: `${inr(p.perPerson)} per person` } : { type: 'Per person', text: 'Contact for Pricing' }
  }
  if (p.mode === 'per_vehicle') {
    const prices = p.vehicles.map((v) => v.price).filter((x): x is number => !!x)
    if (!prices.length) return { type: 'Per vehicle', text: 'Contact for Pricing' }
    const min = Math.min(...prices)
    return { type: 'Per vehicle', text: `Vehicle package from ${inr(min)}` }
  }
  return { type: 'Custom quote', text: 'Request a Quote' }
}

export const pricingModeLabel = { per_person: 'Per person', per_vehicle: 'Per vehicle', custom: 'Custom quote' } as const

export type Estimate =
  | { ok: true; total: number; lines: { label: string; value: number }[]; warnings: string[] }
  | { ok: false; reason: string }

export function estimate(tour: Tour, travellers: number, vehicleId?: string): Estimate {
  const p = tour.pricing
  if (p.mode === 'custom') return { ok: false, reason: 'This package is priced individually. Please send an enquiry for a quote.' }
  if (!travellers || travellers < 1) return { ok: false, reason: 'Enter the number of travellers.' }
  const warnings: string[] = []
  if (p.mode === 'per_person') {
    if (!p.perPerson) return { ok: false, reason: 'The price for this package has not been set. Please contact us.' }
    if (p.minGroup && travellers < p.minGroup) warnings.push(`This price applies to a minimum of ${p.minGroup} travellers. Smaller groups should confirm with us.`)
    if (p.maxGroup && travellers > p.maxGroup) warnings.push(`The configured maximum group size is ${p.maxGroup}. Please contact us for larger groups.`)
    const lines = [{ label: `${inr(p.perPerson)} × ${travellers} travellers`, value: p.perPerson * travellers }]
    if (p.perPersonExtra) lines.push({ label: 'Additional charge', value: p.perPersonExtra })
    return { ok: true, total: lines.reduce((s, l) => s + l.value, 0), lines, warnings }
  }
  const v: VehicleRate | undefined = p.vehicles.find((x) => x.id === vehicleId)
  if (!v) return { ok: false, reason: 'Select a vehicle to see an estimate.' }
  if (!v.price) return { ok: false, reason: 'The rate for this vehicle has not been set. Please contact us.' }
  if (v.seats && travellers > v.seats) warnings.push(`${v.type} seats ${v.seats}. Choose a larger vehicle or contact us for multiple vehicles.`)
  const lines = [{ label: `${v.type} package (flat rate)`, value: v.price }]
  if (v.extraCharge) lines.push({ label: 'Additional charge', value: v.extraCharge })
  return { ok: true, total: lines.reduce((s, l) => s + l.value, 0), lines, warnings }
}
