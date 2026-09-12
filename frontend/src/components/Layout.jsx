import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const links = [
  ['Work', '/work'],
  ['Writing', '/blog'],
  ['Lessons', '/lessons'],
  ['Photographs', '/photos'],
  ['Videos', '/videos'],
]

export default function Layout() {
  const { user, isAdmin, signout } = useAuth()

  return (
    <div className="shell">
      <header className="nav">
        <NavLink to="/" className="brand">
          Souhardya Chakrabarti
        </NavLink>
        <nav className="nav-links">
          {links.map(([label, href]) => (
            <NavLink key={href} to={href}>
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className="pill">
              Studio
            </NavLink>
          )}
          {user ? (
            <>
              <span className="meta">{user.name}</span>
              <button className="link" type="button" onClick={signout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin">Sign in</NavLink>
              <NavLink to="/signup" className="pill solid">
                Join
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="wrap">
          Kolkata · chakrabartisouhardya007@gmail.com · Built for writing, teaching, and pictures.
        </div>
      </footer>
    </div>
  )
}
