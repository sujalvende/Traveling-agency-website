import type { Settings, Tour } from './types'

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[–—]/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100)

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`

export function waLink(settings: Settings, message: string) {
  const num = settings.whatsapp.replace(/\D/g, '')
  return num ? `https://wa.me/${num}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`
}

export const tourMessage = (t: Tour) =>
  `Hello, I am interested in the ${t.title} tour. Please share the itinerary, available travel dates, vehicle options, and total package cost.`

export const generalMessage = 'Hello, I would like to plan a trip. Please share your available tour packages.'

export function readImage(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return reject(new Error('Only JPG, PNG or WebP images are allowed.'))
    if (file.size > 8 * 1024 * 1024) return reject(new Error('Image must be under 8 MB.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.78))
    }
    img.onerror = () => reject(new Error('Could not read that image.'))
    img.src = url
  })
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const routeOf = (t: Tour) => t.stops.map((s) => s.name).join(' → ')
