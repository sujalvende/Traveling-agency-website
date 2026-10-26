import { Link } from 'react-router'
import { useTitle } from '../components/Common'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="container-x py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl text-forest">We couldn't find that page</h1>
      <p className="mt-3 text-muted">The tour may have been unpublished or the link may be incorrect.</p>
      <Link to="/tours" className="btn btn-primary mt-6">Browse tour packages</Link>
    </div>
  )
}
