import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function SignUp() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signup(name, email, password)
      nav('/')
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
        <h1>Join</h1>
        <p className="meta">Creates a reader account. Publishing stays in the admin studio.</p>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </div>
        <p className="meta" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
