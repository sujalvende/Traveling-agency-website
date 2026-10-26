import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router'
import { useData } from '../lib/store'
import { generalMessage, waLink } from '../lib/utils'
import { SectionHead, useTitle } from '../components/Common'
import EnquiryForm from '../components/EnquiryForm'

export function About() {
  const { settings: s } = useData()
  useTitle(`About Us | ${s.companyName}`, s.description.slice(0, 155))
  return (
    <div className="container-x max-w-4xl py-14">
      <SectionHead eyebrow="About us" title={s.companyName} />
      <p className="whitespace-pre-line text-lg leading-relaxed text-ink/85">{s.description}</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {s.strengths.map((x) => <div key={x.id} className="card p-5"><h3 className="text-lg text-forest">{x.title}</h3><p className="mt-1 text-sm text-muted">{x.text}</p></div>)}
      </div>
      <Link to="/tours" className="btn btn-primary mt-10">Explore Tour Packages</Link>
    </div>
  )
}

export function Contact() {
  const { settings: s } = useData()
  useTitle(`Contact | ${s.companyName}`, 'Send an enquiry or message us on WhatsApp.')
  return (
    <div className="container-x grid gap-12 py-14 lg:grid-cols-2">
      <div>
        <SectionHead eyebrow="Contact" title="Plan your trip with us">Send an enquiry and our team will reach out. You can also message us on WhatsApp.</SectionHead>
        <ul className="space-y-4">
          <li className="flex gap-3"><Phone className="text-saffron-deep" />{s.phone || 'Phone not set yet (Admin → Settings)'}</li>
          <li className="flex gap-3"><Mail className="text-saffron-deep" />{s.email || 'Email not set yet'}</li>
          <li className="flex gap-3"><MapPin className="text-saffron-deep" />{s.address || 'Address not set yet'}</li>
        </ul>
        <a href={waLink(s, generalMessage)} target="_blank" rel="noreferrer" className="btn btn-primary mt-8"><MessageCircle size={18} />Chat on WhatsApp</a>
        {!s.whatsapp && <p className="mt-2 text-xs text-muted">WhatsApp number not configured yet.</p>}
      </div>
      <div className="card p-6 md:p-8"><h2 className="mb-5 text-2xl text-forest">Send an enquiry</h2><EnquiryForm /></div>
    </div>
  )
}

export function Privacy() {
  const { settings: s } = useData()
  useTitle('Privacy Policy')
  return (
    <div className="container-x max-w-3xl py-14">
      <SectionHead eyebrow="Legal" title="Privacy Policy" />
      <div className="space-y-4 text-ink/85">
        <p>{s.companyName} collects only the details you enter in an enquiry form: your name, mobile number, optional email, and trip preferences. We use them solely to respond to your enquiry and to prepare a quotation.</p>
        <p>We do not sell your information. You can ask us to delete your enquiry at any time by contacting us at {s.email || 'the email listed on our contact page'}.</p>
        <p className="text-sm text-muted">Template text: have it reviewed before launch.</p>
      </div>
    </div>
  )
}
