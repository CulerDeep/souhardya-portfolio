import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function SignIn() {
  const { signin } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await signin(email, password)
      nav(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wrap page">
      <form className="auth-card" onSubmit={onSubmit}>
        <p className="kicker">Account</p>
        <h1>Sign in</h1>
        <p className="meta">Visitors get a reader account. The studio login is admin-only.</p>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
        <p className="meta" style={{ marginTop: '1rem' }}>
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
