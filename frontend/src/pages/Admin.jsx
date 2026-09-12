import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Admin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  async function load() {
    try {
      setItems(await api.list())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function remove(id) {
    if (!window.confirm('Delete this piece?')) return
    await api.remove(id)
    load()
  }

  return (
    <div className="wrap page">
      <div className="admin-head">
        <div>
          <p className="kicker">Admin</p>
          <h1>Studio</h1>
          <p className="meta">Publish blogs, lessons, photographs, and videos. Nothing is persisted yet.</p>
        </div>
        <Link className="btn" to="/admin/new">
          New piece
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      <div style={{ overflowX: 'auto', marginTop: '1.4rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Kind</th>
              <th>Title</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.kind}</td>
                <td>{item.title}</td>
                <td>{item.published ? 'Live' : 'Draft'}</td>
                <td className="actions">
                  <Link className="btn ghost" to={`/admin/${item.id}`}>
                    Edit
                  </Link>
                  <button className="btn danger" type="button" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
