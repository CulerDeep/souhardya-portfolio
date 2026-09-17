import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { useLanguage } from '../LanguageContext.jsx'
import LanguagePicker from './LanguagePicker.jsx'

const links = [
  ['work', '/work'],
  ['writing', '/blog'],
  ['lessons', '/lessons'],
  ['photos', '/photos'],
  ['videos', '/videos'],
]

export default function Layout() {
  const { user, isAdmin, signout } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="shell">
      <header className="nav">
        <NavLink to="/" className="brand">
          {t('common.brand_name')}
        </NavLink>
        <nav className="nav-links">
          {links.map(([key, href]) => (
            <NavLink key={href} to={href}>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="pill">
              {t('nav.studio')}
            </NavLink>
          )}
          {user ? (
            <>
              <span className="meta">{user.name}</span>
              <button className="link" type="button" onClick={signout}>
                {t('nav.signout')}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin">{t('nav.signin')}</NavLink>
              <NavLink to="/signup" className="pill solid">
                {t('nav.join')}
              </NavLink>
            </>
          )}
          <LanguagePicker />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="wrap">
          {t('footer.text')}
        </div>
      </footer>
    </div>
  )
}
