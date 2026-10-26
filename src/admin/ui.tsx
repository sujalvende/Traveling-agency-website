import { useRef, useState } from 'react'
import { Upload, ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react'
import { readImage } from '../lib/utils'

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <div><label className="label">{label}</label>{children}{hint && <p className="mt-1 text-xs text-muted">{hint}</p>}</div>
}

export function ImageInput({ value, onChange, label = 'Image' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [err, setErr] = useState('')
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-start gap-3">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-sand">{value && <img src={value} alt="" className="h-full w-full object-cover" />}</div>
        <div className="min-w-0 flex-1 space-y-2">
          <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return
            try { setErr(''); onChange(await readImage(f)) } catch (x) { setErr((x as Error).message) }
            e.target.value = ''
          }} />
          <button type="button" className="btn btn-outline btn-sm" onClick={() => ref.current?.click()}><Upload size={14} />Upload</button>
          <input className="field !min-h-9 !py-1.5 text-xs" placeholder="…or paste an image URL" value={value.startsWith('data:') ? '' : value} onChange={(e) => onChange(e.target.value)} />
          {err && <p className="text-xs text-red-700">{err}</p>}
        </div>
      </div>
    </div>
  )
}

export function RowTools({ i, n, move, remove }: { i: number; n: number; move: (from: number, to: number) => void; remove: () => void }) {
  return (
    <div className="flex gap-1">
      <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)} className="btn btn-outline btn-sm !px-2"><ArrowUp size={14} /></button>
      <button type="button" aria-label="Move down" disabled={i === n - 1} onClick={() => move(i, i + 1)} className="btn btn-outline btn-sm !px-2"><ArrowDown size={14} /></button>
      <button type="button" aria-label="Remove" onClick={remove} className="btn btn-sm !px-2 border border-red-300 text-red-700 hover:bg-red-50"><Trash2 size={14} /></button>
    </div>
  )
}

export function moveItem<T>(arr: T[], from: number, to: number) {
  const a = [...arr]; const [x] = a.splice(from, 1); a.splice(to, 0, x); return a
}

export const AddBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className="btn btn-outline btn-sm"><Plus size={14} />{children}</button>
)

export function Toast({ msg, kind = 'ok' }: { msg: string; kind?: 'ok' | 'err' }) {
  if (!msg) return null
  return <div role="status" className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg ${kind === 'ok' ? 'bg-forest' : 'bg-red-700'}`}>{msg}</div>
}

export function useToast() {
  const [t, setT] = useState<{ msg: string; kind: 'ok' | 'err' }>({ msg: '', kind: 'ok' })
  const show = (msg: string, kind: 'ok' | 'err' = 'ok') => { setT({ msg, kind }); setTimeout(() => setT({ msg: '', kind: 'ok' }), 2800) }
  return { toast: <Toast {...t} />, show }
}

export function Confirm({ text, onYes, onNo }: { text: string; onYes: () => void; onNo: () => void }) {
  return (
    <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card max-w-sm p-6"><p className="text-ink">{text}</p><div className="mt-5 flex justify-end gap-2"><button className="btn btn-outline btn-sm" onClick={onNo}>Cancel</button><button className="btn btn-sm bg-red-700 text-white hover:bg-red-800" onClick={onYes}>Delete</button></div></div>
    </div>
  )
}
