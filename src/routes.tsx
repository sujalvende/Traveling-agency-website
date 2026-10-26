import { createBrowserRouter } from 'react-router'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import { Destinations, DestinationDetail } from './pages/Destinations'
import Gallery from './pages/Gallery'
import { About, Contact, Privacy } from './pages/Static'
import NotFound from './pages/NotFound'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import { ToursList, TourEditor } from './admin/Tours'
import { DestinationsAdmin, CategoriesAdmin, GalleryAdmin, EnquiriesAdmin } from './admin/Manage'
import SettingsPage from './admin/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: 'tours', Component: Tours },
      { path: 'tours/:slug', Component: TourDetail },
      { path: 'destinations', Component: Destinations },
      { path: 'destinations/:slug', Component: DestinationDetail },
      { path: 'gallery', Component: Gallery },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'privacy', Component: Privacy },
      { path: '*', Component: NotFound },
    ],
  },
  { path: '/admin/login', Component: Login },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'dashboard', Component: Dashboard },
      { path: 'tours', Component: ToursList },
      { path: 'tours/:id', Component: TourEditor },
      { path: 'destinations', Component: DestinationsAdmin },
      { path: 'categories', Component: CategoriesAdmin },
      { path: 'gallery', Component: GalleryAdmin },
      { path: 'enquiries', Component: EnquiriesAdmin },
      { path: 'settings', Component: SettingsPage },
    ],
  },
])
