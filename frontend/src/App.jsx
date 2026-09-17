import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import Collection from './pages/Collection.jsx'
import Piece from './pages/Piece.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Admin from './pages/Admin.jsx'
import Editor from './pages/Editor.jsx'

function AdminGate({ children }) {
  const { ready, isAdmin, user } = useAuth()
  if (!ready) return <p className="wrap page">Loading…</p>
  if (!user) return <Navigate to="/signin" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/blog" element={<Collection kind="blog" />} />
        <Route path="/lessons" element={<Collection kind="lesson" />} />
        <Route path="/photos" element={<Collection kind="photo" />} />
        <Route path="/videos" element={<Collection kind="video" />} />
        <Route path="/:kind/:id" element={<Piece />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/admin"
          element={
            <AdminGate>
              <Admin />
            </AdminGate>
          }
        />
        <Route
          path="/admin/new"
          element={
            <AdminGate>
              <Editor />
            </AdminGate>
          }
        />
        <Route
          path="/admin/:id"
          element={
            <AdminGate>
              <Editor />
            </AdminGate>
          }
        />
      </Route>
    </Routes>
  )
}
