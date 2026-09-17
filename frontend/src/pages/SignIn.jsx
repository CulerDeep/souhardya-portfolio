import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useLanguage } from '../LanguageContext.jsx'

export default function SignIn() {
  const { signin } = useAuth()
  const { t } = useLanguage()
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
        <p className="kicker">{t('auth.signin_title')}</p>
        <h1>{t('auth.signin_title')}</h1>
        <label>{t('auth.email')}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>{t('auth.password')}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? t('common.loading') : t('auth.signin_btn')}
          </button>
        </div>
        <p className="meta" style={{ marginTop: '1rem' }}>
          <Link to="/signup">{t('auth.no_account')}</Link>
        </p>
      </form>
    </div>
  )
}
