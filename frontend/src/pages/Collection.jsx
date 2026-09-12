import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const copy = {
  blog: { path: '/blog', empty: 'No essays yet.' },
  lesson: { path: '/lessons', empty: 'No lessons published yet.' },
  photo: { path: '/photos', empty: 'The gallery is empty.' },
  video: { path: '/videos', empty: 'No videos yet.' },
}

export default function Collection({ kind, title, kicker }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    api.list(kind).then(setItems).catch((e) => setError(e.message))
  }, [kind])

  const conf = copy[kind]

  if (kind === 'photo') {
    return (
      <div className="wrap page">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {error && <p className="error">{error}</p>}
        {items.length === 0 ? (
          <p className="empty">{conf.empty}</p>
        ) : (
          <div className="photo-grid">
            {items.map((item) => (
              <figure key={item.id}>
                <Link to={`${conf.path}/${item.id}`}>
                  <img src={item.cover_url || item.media_url} alt={item.title} />
                </Link>
                <figcaption>
                  <strong>{item.title}</strong>
                  <div className="meta">{item.summary}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="wrap page">
      <p className="kicker">{kicker}</p>
      <h1>{title}</h1>
      {error && <p className="error">{error}</p>}
      {items.length === 0 ? (
        <p className="empty">{conf.empty}</p>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <Link className="card" key={item.id} to={`${conf.path}/${item.id}`}>
              {item.cover_url && <img src={item.cover_url} alt="" />}
              <div className="card-body">
                <h3>{item.title}</h3>
                <p className="meta">{item.summary}</p>
                <div className="tags">
                  {(item.tags || []).map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
