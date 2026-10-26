import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { adminIsSetUp, loginAdmin, setupAdmin } from '../lib/store'
import { useTitle } from '../components/Common'

export default function Login() {
  useTitle('Admin Login')
  const nav = useNavigate()
  const setup = !adminIsSetUp()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (setup) {
      if (pw.length < 8) return setErr('Use at least 8 characters.')
      if (pw !== pw2) return setErr('Passwords do not match.')
      await setupAdmin(pw); nav('/admin/dashboard')
    } else if (await loginAdmin(pw)) nav('/admin/dashboard')
    else setErr('Incorrect password.')
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-deep p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-8">
        <h1 className="text-2xl text-forest">{setup ? 'Create admin password' : 'Admin login'}</h1>
        <p className="text-sm text-muted">{setup ? 'First-time setup: choose a password for this browser. No default password exists.' : 'Enter your admin password.'}</p>
        <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" autoComplete={setup ? 'new-password' : 'current-password'} className="field" value={pw} onChange={(e) => { setPw(e.target.value); setErr('') }} /></div>
        {setup && <div><label className="label" htmlFor="pw2">Confirm password</label><input id="pw2" type="password" autoComplete="new-password" className="field" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>}
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button className="btn btn-primary w-full">{setup ? 'Create & sign in' : 'Sign in'}</button>
        <p className="text-xs text-muted">Demo mode: stored in this browser only. <Link to="/" className="underline">Back to site</Link></p>
      </form>
    </div>
  )
}
