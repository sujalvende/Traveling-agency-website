export type PricingMode = 'per_person' | 'per_vehicle' | 'custom'

export interface VehicleRate {
  id: string
  type: string
  seats: number
  price: number | null
  extraCharge: number | null
  conditions: string
  included: string
  notes: string
}

export interface Pricing {
  mode: PricingMode
  currency: 'INR'
  perPerson: number | null
  minGroup: number | null
  maxGroup: number | null
  perPersonExtra: number | null
  conditions: string
  additionalCharges: string
  vehicles: VehicleRate[]
  isDemo: boolean
}

export interface Stop {
  id: string
  name: string
  destinationId: string | null
  description: string
  image: string
  day: number
  duration: string
  timing: string
  notes: string
}

export interface TourImage { id: string; src: string; caption: string }
export interface Faq { q: string; a: string }

export interface Tour {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  cover: string
  categoryIds: string[]
  durationLabel: string
  durationDays: number
  departureInfo: string
  published: boolean
  featured: boolean
  inclusions: string[]
  exclusions: string[]
  travelInfo: string[]
  faqs: Faq[]
  pricing: Pricing
  stops: Stop[]
  gallery: TourImage[]
  createdAt: string
  updatedAt: string
  isDemo: boolean
}

export interface Destination {
  id: string
  name: string
  slug: string
  description: string
  image: string
  lat: number | null
  lng: number | null
  order: number
}

export interface Category { id: string; name: string; slug: string; description: string }

export interface GalleryImage { id: string; src: string; caption: string; destinationId: string | null; tourId: string | null; categoryId: string | null }

export type EnquiryStatus = 'New' | 'Contacted' | 'Quote Sent' | 'Confirmed' | 'Closed'
export const ENQUIRY_STATUSES: EnquiryStatus[] = ['New', 'Contacted', 'Quote Sent', 'Confirmed', 'Closed']

export interface Enquiry {
  id: string
  name: string
  mobile: string
  email: string
  tourId: string | null
  tourTitle: string
  travelDate: string
  travellers: number
  vehicle: string
  pricingPreference: string
  requirements: string
  status: EnquiryStatus
  notes: string
  createdAt: string
}

export interface Testimonial { id: string; name: string; place: string; text: string; isDemo: boolean }
export interface Strength { id: string; title: string; text: string }

export interface Settings {
  companyName: string
  tagline: string
  logo: string
  phone: string
  whatsapp: string
  email: string
  address: string
  description: string
  footerText: string
  social: { facebook: string; instagram: string; youtube: string }
  currency: 'INR'
  heroImage: string
  strengths: Strength[]
}

export interface Data {
  tours: Tour[]
  destinations: Destination[]
  categories: Category[]
  gallery: GalleryImage[]
  enquiries: Enquiry[]
  testimonials: Testimonial[]
  settings: Settings
  tourViews: Record<string, number>
}
