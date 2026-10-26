import { useSyncExternalStore } from 'react'
import type { Data } from './types'
import { seedData } from './seed'

const KEY = 'tt_data_v1'
const listeners = new Set<() => void>()

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Data
  } catch { /* fall through to seed */ }
  return seedData()
}

let state: Data = load()

export function getData() { return state }

export function update(fn: (d: Data) => Data): { ok: boolean; error?: string } {
  const next = fn(structuredClone(state))
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    return { ok: false, error: 'Browser storage is full. Remove some large images and try again.' }
  }
  state = next
  listeners.forEach((l) => l())
  return { ok: true }
}

export function resetToDemo() {
  localStorage.removeItem(KEY)
  state = seedData()
  listeners.forEach((l) => l())
}

export function useData(): Data {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state,
  )
}

// Demo-mode admin auth: a password hash in localStorage + a session flag.
const HASH = 'tt_admin_hash'
const SESSION = 'tt_admin_session'
async function sha(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('tt-demo:' + text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
export const adminIsSetUp = () => !!localStorage.getItem(HASH)
export const isAdminLoggedIn = () => sessionStorage.getItem(SESSION) === '1'
export async function setupAdmin(password: string) {
  localStorage.setItem(HASH, await sha(password))
  sessionStorage.setItem(SESSION, '1')
}
export async function loginAdmin(password: string) {
  if ((await sha(password)) === localStorage.getItem(HASH)) { sessionStorage.setItem(SESSION, '1'); return true }
  return false
}
export async function changeAdminPassword(current: string, next: string) {
  if ((await sha(current)) !== localStorage.getItem(HASH)) return false
  localStorage.setItem(HASH, await sha(next)); return true
}
export const logoutAdmin = () => sessionStorage.removeItem(SESSION)
