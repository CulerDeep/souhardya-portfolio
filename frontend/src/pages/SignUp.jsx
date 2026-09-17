import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useLanguage } from '../LanguageContext.jsx'

export default function SignUp() {
  const { signup } = useAuth()
  const { t } = useLanguage()
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
        <p className="kicker">{t('auth.signup_title')}</p>
        <h1>{t('auth.signup_title')}</h1>
        <label>{t('auth.name')}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>{t('auth.email')}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>{t('auth.password')}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? t('common.loading') : t('auth.signup_btn')}
          </button>
        </div>
        <p className="meta" style={{ marginTop: '1rem' }}>
          <Link to="/signin">{t('auth.has_account')}</Link>
        </p>
      </form>
    </div>
  )
}
