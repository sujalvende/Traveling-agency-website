import type { Data, Pricing, Stop, Tour, VehicleRate } from './types'

const u = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?w=${w}&fit=crop&auto=format&q=75`
export const IMG = {
  temple1: u('1759134334610-488eb3937c82'),
  temple2: u('1619245868841-55220226b05a'),
  temple3: u('1619239632374-9e6651c2b7bb'),
  temple4: u('1625807161536-27903f2200fa'),
  temple5: u('1705723116788-d11fa6e3f415'),
  tower: u('1693134322630-8c3510d215f6'),
  hill1: u('1590798766926-b2beb93ff56e'),
  hill2: u('1567328169564-f8e536e1450f'),
  hill3: u('1753247185885-98ee34468c4f'),
  beach1: u('1549608276-869958360997'),
  beach2: u('1685271552630-9bc169185566'),
  beach3: u('1605015239078-95f963a8b35c'),
  fort1: u('1591018653367-9c01498b3320'),
  fort2: u('1643269877099-ea5393b80320'),
  fort3: u('1713729991304-d0b6c328560e'),
  flowers: u('1635424785729-c022fc1a61bd'),
  diya: u('1641296834408-b09a187937d5'),
  diya2: u('1675507324032-37e36995b2c4'),
}

const now = new Date().toISOString()
let n = 0
const id = (p: string) => `${p}_${++n}`

const dests = [
  ['akkalkot', 'Akkalkot', 'A town known for its Swami Samarth Maharaj temple, visited by devotees from across Maharashtra and beyond.', IMG.temple1],
  ['tuljapur', 'Tuljapur', 'Home to the Tulja Bhavani temple, one of the revered Shakti shrines of Maharashtra.', IMG.temple2],
  ['solapur', 'Solapur – Siddharameshwar', 'The Siddharameshwar temple and its lake setting in Solapur form a calm stop on the pilgrimage circuit.', IMG.temple4],
  ['pandharpur', 'Pandharpur', 'The abode of Lord Vitthal on the banks of the Chandrabhaga, centre of the Warkari tradition.', IMG.temple3],
  ['jejuri', 'Jejuri', 'The hilltop Khandoba temple, famous for its flight of steps and golden turmeric-hued temple complex.', IMG.diya],
  ['bhimashankar', 'Bhimashankar', 'A Jyotirlinga temple set in forested Sahyadri hills.', IMG.hill3],
  ['trimbakeshwar', 'Trimbakeshwar', 'A Jyotirlinga temple near the source of the Godavari river.', IMG.temple5],
  ['mahabaleshwar', 'Mahabaleshwar', 'A Sahyadri hill station with viewpoints, forest roads and cool weather.', IMG.hill1],
  ['goa', 'Goa', 'Beaches, old churches and relaxed coastal evenings.', IMG.beach2],
  ['rajasthan', 'Jaipur', 'Forts, palaces and bazaars in the Pink City.', IMG.fort1],
] as const

const destinations = dests.map(([slug, name, description, image], i) => ({
  id: `dest_${slug}`, name, slug, description, image, lat: null, lng: null, order: i,
}))
const D = (slug: string) => `dest_${slug}`
const dname = (slug: string) => destinations.find((d) => d.slug === slug)!

const stop = (slug: string, day: number, description: string, extra: Partial<Stop> = {}): Stop => ({
  id: id('stop'), name: dname(slug).name, destinationId: D(slug), description, image: dname(slug).image, day, duration: '', timing: '', notes: '', ...extra,
})

const vehicle = (type: string, seats: number, price: number | null, extra: Partial<VehicleRate> = {}): VehicleRate => ({
  id: id('veh'), type, seats, price, extraCharge: null, conditions: '', included: 'Vehicle and driver', notes: '', ...extra,
})

const basePricing: Pricing = {
  mode: 'custom', currency: 'INR', perPerson: null, minGroup: null, maxGroup: null, perPersonExtra: null,
  conditions: '', additionalCharges: '', vehicles: [], isDemo: true,
}

const common = {
  published: true, createdAt: now, updatedAt: now, isDemo: true,
  inclusions: ['Transport as per the selected package', 'Driver allowance', 'Planned route and itinerary'],
  exclusions: ['Meals and personal expenses', 'Temple offerings and special darshan tickets', 'Anything not mentioned under inclusions'],
  travelInfo: [
    'Dress modestly for temple visits.',
    'Temple timings and queues vary by day and festival; the final plan is confirmed at the time of booking.',
    'Carry a valid photo ID.',
  ],
}

const tours: Tour[] = [
  {
    ...common, id: 'tour_1', slug: 'akkalkot-tuljapur-siddharameshwar-pandharpur-jejuri-darshan',
    title: 'Akkalkot – Tuljapur – Siddharameshwar – Pandharpur – Jejuri Darshan',
    shortDescription: 'A multi-day pilgrimage circuit covering five important temple towns of Maharashtra in one planned journey.',
    description: 'A comfortable pilgrimage circuit connecting Akkalkot, Tuljapur, Siddharameshwar (Solapur), Pandharpur and Jejuri. Ideal for families and senior citizens who want a well-planned darshan route without arranging each leg separately. This is demo content: replace itinerary details, timings and prices with your actual plan.',
    cover: IMG.temple3, categoryIds: ['cat_pilgrimage', 'cat_temple', 'cat_multi'], durationLabel: '3 Days / 2 Nights', durationDays: 3,
    departureInfo: 'Departure dates are arranged on request. Please share your preferred date.', featured: true,
    pricing: {
      ...basePricing, mode: 'per_vehicle', isDemo: true,
      conditions: 'Demo prices. Final price depends on pickup location, season and confirmed itinerary.',
      additionalCharges: 'Tolls, parking and night-halt charges may apply as confirmed by the company.',
      vehicles: [
        vehicle('Sedan', 4, 6000, { conditions: 'Demo rate for this route', notes: 'Suitable for small families' }),
        vehicle('Ertiga (or equivalent)', 6, 9000, { extraCharge: 500, conditions: 'Demo rate for this route', notes: 'Extra charge = demo night-halt allowance' }),
        vehicle('Tempo Traveller', 12, 16000, { extraCharge: 1000, conditions: 'Demo rate for this route', notes: 'For larger groups' }),
      ],
    },
    stops: [
      stop('akkalkot', 1, 'Begin the circuit with darshan at the Swami Samarth temple.', { duration: 'Half day' }),
      stop('solapur', 1, 'Visit the Siddharameshwar temple on the way.', { duration: '1–2 hours' }),
      stop('tuljapur', 2, 'Darshan at the Tulja Bhavani temple.', { duration: 'Half day' }),
      stop('pandharpur', 2, 'Darshan of Lord Vitthal and a walk along the Chandrabhaga.', { duration: 'Half day', notes: 'Queue time varies, especially during Ekadashi.' }),
      stop('jejuri', 3, 'Climb to the Khandoba temple, then return journey.', { duration: '2–3 hours', notes: 'Includes a flight of steps; palanquin help may be available locally.' }),
    ],
    gallery: [
      { id: id('img'), src: IMG.temple1, caption: 'Temple architecture (illustrative photo)' },
      { id: id('img'), src: IMG.diya, caption: 'Offerings and lamps (illustrative photo)' },
      { id: id('img'), src: IMG.flowers, caption: 'Marigold offerings (illustrative photo)' },
    ],
    faqs: [
      { q: 'Can senior citizens join this tour?', a: 'Yes. Please mention mobility needs in your enquiry so the plan can be adjusted.' },
      { q: 'Is the price final?', a: 'No. Prices shown are estimates until confirmed by our team.' },
    ],
  },
  {
    ...common, id: 'tour_2', slug: 'pandharpur-vitthal-darshan-day-trip', title: 'Pandharpur Vitthal Darshan – One Day Trip',
    shortDescription: 'A single-day darshan trip to Pandharpur with a relaxed schedule.',
    description: 'A simple one-day journey for darshan at the Vitthal temple in Pandharpur. Demo content: edit details and prices from the admin panel.',
    cover: IMG.temple2, categoryIds: ['cat_oneday', 'cat_pilgrimage', 'cat_temple'], durationLabel: '1 Day', durationDays: 1,
    departureInfo: 'Morning departure. Date arranged on request.', featured: true,
    pricing: { ...basePricing, mode: 'per_person', perPerson: 1500, minGroup: 10, maxGroup: 40, perPersonExtra: null, isDemo: true, conditions: 'Demo price. Applicable for group departures; minimum 10 travellers.', additionalCharges: 'Meals and special darshan passes not included.' },
    stops: [stop('pandharpur', 1, 'Darshan at the Vitthal-Rukmini temple and time by the river.', { duration: 'Most of the day' })],
    gallery: [{ id: id('img'), src: IMG.temple4, caption: 'Temple town (illustrative photo)' }],
    faqs: [],
  },
  {
    ...common, id: 'tour_3', slug: 'maharashtra-jyotirlinga-yatra', title: 'Maharashtra Jyotirlinga Yatra',
    shortDescription: 'Bhimashankar and Trimbakeshwar in a planned multi-day journey. Custom quote.',
    description: 'A customised route covering Jyotirlinga temples in Maharashtra. Because group size, vehicle and dates vary, we prepare a personal quote. Demo content.',
    cover: IMG.hill3, categoryIds: ['cat_jyotirlinga', 'cat_pilgrimage', 'cat_multi'], durationLabel: '3 Days / 2 Nights', durationDays: 3,
    departureInfo: 'Custom dates on request.', featured: true,
    pricing: { ...basePricing, mode: 'custom', isDemo: true },
    stops: [
      stop('bhimashankar', 1, 'Darshan at Bhimashankar amid forested hills.', { duration: 'Half day' }),
      stop('trimbakeshwar', 2, 'Darshan at Trimbakeshwar near the Godavari source.', { duration: 'Half day' }),
    ],
    gallery: [], faqs: [],
  },
  {
    ...common, id: 'tour_4', slug: 'mahabaleshwar-weekend-family-trip', title: 'Mahabaleshwar Weekend Family Trip',
    shortDescription: 'Cool hills, viewpoints and unhurried family time.',
    description: 'A relaxed weekend in the Sahyadri hills. Demo content: add your hotel partners, viewpoints and pricing.',
    cover: IMG.hill1, categoryIds: ['cat_family', 'cat_hill', 'cat_multi'], durationLabel: '2 Days / 1 Night', durationDays: 2,
    departureInfo: 'Weekend departures on request.', featured: false,
    inclusions: ['Transport', 'Sightseeing as per itinerary'], exclusions: ['Accommodation unless confirmed', 'Meals', 'Entry tickets'], travelInfo: common.travelInfo.slice(2),
    published: true, createdAt: now, updatedAt: now, isDemo: true,
    pricing: { ...basePricing, mode: 'per_person', perPerson: 3200, minGroup: 4, maxGroup: null, isDemo: true, conditions: 'Demo price; transport and sightseeing only.' },
    stops: [stop('mahabaleshwar', 1, 'Viewpoints and local markets.', { duration: 'Full day' })],
    gallery: [{ id: id('img'), src: IMG.hill2, caption: 'Hills (illustrative photo)' }], faqs: [],
  },
  {
    ...common, id: 'tour_5', slug: 'goa-beach-escape', title: 'Goa Beach Escape',
    shortDescription: 'Sun, sand and slow evenings on the Goan coast.',
    description: 'A beach holiday tailored to your dates and group. Request a quote. Demo content.',
    cover: IMG.beach1, categoryIds: ['cat_beach', 'cat_family', 'cat_multi', 'cat_custom'], durationLabel: '4 Days / 3 Nights', durationDays: 4,
    departureInfo: 'Custom dates on request.', featured: false,
    pricing: { ...basePricing, mode: 'custom', isDemo: true },
    stops: [stop('goa', 1, 'Beaches, old churches and local food.', { duration: 'Full days' })],
    gallery: [{ id: id('img'), src: IMG.beach3, caption: 'Coast (illustrative photo)' }], faqs: [],
  },
  {
    ...common, id: 'tour_6', slug: 'jaipur-heritage-tour', title: 'Jaipur Heritage Tour',
    shortDescription: 'Forts, palaces and bazaars of the Pink City.',
    description: 'A historical sightseeing tour. Pricing not yet supplied; contact us for a quote. Demo content.',
    cover: IMG.fort1, categoryIds: ['cat_history', 'cat_multi'], durationLabel: '3 Days / 2 Nights', durationDays: 3,
    departureInfo: 'On request.', featured: false, published: false,
    pricing: { ...basePricing, mode: 'per_person', perPerson: null, isDemo: true },
    stops: [stop('rajasthan', 1, 'Amber Fort and city palace area.', { duration: 'Full day' })],
    gallery: [], faqs: [],
  },
]

const cat = (slug: string, name: string, description: string) => ({ id: `cat_${slug}`, name, slug, description })

export const seedData = (): Data => ({
  tours,
  destinations,
  categories: [
    cat('temple', 'Temple Darshan', 'Visits to important temples.'),
    cat('pilgrimage', 'Pilgrimage Tours', 'Planned yatras for devotees.'),
    cat('oneday', 'One-Day Tours', 'Return trips completed in a day.'),
    cat('multi', 'Multi-Day Tours', 'Journeys across several days.'),
    cat('jyotirlinga', 'Jyotirlinga Tours', 'Routes covering Jyotirlinga temples.'),
    cat('family', 'Family Trips', 'Comfortable trips for families.'),
    cat('history', 'Historical Places', 'Forts, palaces and heritage.'),
    cat('hill', 'Hill Stations', 'Cool-weather getaways.'),
    cat('beach', 'Beach Destinations', 'Coastal holidays.'),
    cat('custom', 'Custom Tours', 'Tailor-made itineraries.'),
  ],
  gallery: [
    { id: 'g1', src: IMG.temple1, caption: 'Temple architecture (illustrative photo)', destinationId: D('akkalkot'), tourId: 'tour_1', categoryId: 'cat_temple' },
    { id: 'g2', src: IMG.temple3, caption: 'Temple town skyline (illustrative photo)', destinationId: D('pandharpur'), tourId: 'tour_1', categoryId: 'cat_pilgrimage' },
    { id: 'g3', src: IMG.diya2, caption: 'Lamps and flowers (illustrative photo)', destinationId: D('jejuri'), tourId: 'tour_1', categoryId: 'cat_temple' },
    { id: 'g4', src: IMG.hill2, caption: 'Sahyadri-style hills (illustrative photo)', destinationId: D('mahabaleshwar'), tourId: 'tour_4', categoryId: 'cat_hill' },
    { id: 'g5', src: IMG.beach2, caption: 'Coastal sunset (illustrative photo)', destinationId: D('goa'), tourId: 'tour_5', categoryId: 'cat_beach' },
    { id: 'g6', src: IMG.fort2, caption: 'Fort architecture (illustrative photo)', destinationId: D('rajasthan'), tourId: 'tour_6', categoryId: 'cat_history' },
    { id: 'g7', src: IMG.flowers, caption: 'Marigold offerings (illustrative photo)', destinationId: null, tourId: null, categoryId: 'cat_pilgrimage' },
  ],
  enquiries: [],
  testimonials: [
    { id: 't1', name: 'Demo Testimonial', place: 'Sample customer, Pune', text: 'This is sample text showing how a real customer testimonial will look. Replace it from Admin → Settings.', isDemo: true },
  ],
  settings: {
    companyName: 'Your Travel Company',
    tagline: 'Tours & Travels',
    logo: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    description: 'We organise pilgrimage tours, temple darshan trips, sightseeing journeys and family holidays. Edit this description from the admin panel.',
    footerText: 'Thoughtfully planned journeys across India.',
    social: { facebook: '', instagram: '', youtube: '' },
    currency: 'INR',
    heroImage: IMG.temple1.replace('w=1400', 'w=2000'),
    strengths: [
      { id: 's1', title: 'Planned itineraries', text: 'Every stop is mapped in advance so the day flows without rushing.' },
      { id: 's2', title: 'Comfortable travel', text: 'Choose from the vehicle options we offer for your group size.' },
      { id: 's3', title: 'Clear pricing', text: 'Per person, per vehicle, or a personal quote. No hidden surprises in how we explain it.' },
      { id: 's4', title: 'Help with enquiries', text: 'Message us on WhatsApp or send a form and our team will respond.' },
      { id: 's5', title: 'Family & group travel', text: 'Routes suited to senior citizens, families and larger groups.' },
      { id: 's6', title: 'Flexible tour choices', text: 'Pick a listed package or ask for a custom route.' },
    ],
  },
  tourViews: {},
})
