import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useLanguage } from '../LanguageContext.jsx'

export default function Admin() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const { t } = useLanguage()

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
          <p className="kicker">{t('nav.studio')}</p>
          <h1>{t('admin.studio_title')}</h1>
          <p className="meta">{t('admin.studio_desc')}</p>
        </div>
        <Link className="btn" to="/admin/new">
          {t('admin.new_piece')}
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      <div style={{ overflowX: 'auto', marginTop: '1.4rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>{t('admin.kind')}</th>
              <th>{t('admin.title')}</th>
              <th>{t('admin.status')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.kind}</td>
                <td>{item.title}</td>
                <td>{item.published ? t('admin.live') : t('admin.draft')}</td>
                <td className="actions">
                  <Link className="btn ghost" to={`/admin/${item.id}`}>
                    {t('admin.edit')}
                  </Link>
                  <button className="btn danger" type="button" onClick={() => remove(item.id)}>
                    {t('admin.delete')}
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
