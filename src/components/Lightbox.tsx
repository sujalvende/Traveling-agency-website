import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface LBImage { src: string; caption: string }

export default function Lightbox({ images, index, onClose, onChange }: { images: LBImage[]; index: number; onClose: () => void; onChange: (i: number) => void }) {
  const next = () => onChange((index + 1) % images.length)
  const prev = () => onChange((index - 1 + images.length) % images.length)
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  })
  const img = images[index]
  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-deep/95 p-4" onClick={onClose}>
      <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
      <img src={img.src} alt={img.caption} onClick={(e) => e.stopPropagation()} className="max-h-[78vh] max-w-full rounded-lg object-contain" />
      <p className="mt-4 text-center text-sm text-white/85">{img.caption} <span className="text-white/50">({index + 1}/{images.length})</span></p>
      {images.length > 1 && (<>
        <button aria-label="Previous image" onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft /></button>
        <button aria-label="Next image" onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight /></button>
      </>)}
    </div>
  )
}
