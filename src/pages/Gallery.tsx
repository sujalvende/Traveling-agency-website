import { useState } from 'react'
import { useData } from '../lib/store'
import { Img, SectionHead, useTitle, Empty } from '../components/Common'
import Lightbox from '../components/Lightbox'

export default function Gallery() {
  const { gallery, destinations, categories, tours } = useData()
  useTitle('Gallery', 'Photographs from destinations and tours.')
  const [by, setBy] = useState<'destination' | 'tour' | 'category'>('destination')
  const [val, setVal] = useState('')
  const [lb, setLb] = useState<number | null>(null)
  const opts = by === 'destination' ? destinations.map((x) => ({ id: x.id, name: x.name })) : by === 'tour' ? tours.filter((t) => t.published).map((x) => ({ id: x.id, name: x.title })) : categories
  const key = by === 'destination' ? 'destinationId' : by === 'tour' ? 'tourId' : 'categoryId'
  const list = gallery.filter((g) => !val || g[key] === val)
  return (
    <div className="container-x py-14">
      <SectionHead eyebrow="Gallery" title="Moments from the road">Photos marked “illustrative” are stock images, not photographs of our actual tours.</SectionHead>
      <div className="mb-8 flex flex-wrap gap-3">
        <select aria-label="Organise by" className="field !w-auto" value={by} onChange={(e) => { setBy(e.target.value as typeof by); setVal('') }}>
          <option value="destination">By destination</option><option value="tour">By tour</option><option value="category">By category</option>
        </select>
        <select aria-label="Filter" className="field !w-auto max-w-full" value={val} onChange={(e) => setVal(e.target.value)}>
          <option value="">All</option>{opts.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>
      {list.length ? (
        <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
          {list.map((g, i) => (
            <button key={g.id} onClick={() => setLb(i)} className="group block w-full overflow-hidden rounded-xl text-left" aria-label={`Open ${g.caption}`}>
              <Img src={g.src} alt={g.caption} className="w-full [&_img]:h-auto [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105" />
              <span className="block bg-paper px-3 py-2 text-xs text-muted">{g.caption}</span>
            </button>
          ))}
        </div>
      ) : <Empty title="No photos here yet" text="Try another filter." />}
      {lb !== null && <Lightbox images={list} index={lb} onClose={() => setLb(null)} onChange={setLb} />}
    </div>
  )
}
