import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'

const kindToPath = {
  blog: '/blog',
  lesson: '/lessons',
  photo: '/photos',
  video: '/videos',
}

export default function Piece() {
  const { kind, id } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(id).then(setItem).catch((e) => setError(e.message))
  }, [id])

  if (error) {
    return (
      <div className="wrap page">
        <p className="error">{error}</p>
        <Link to="/">Back home</Link>
      </div>
    )
  }
  if (!item) return <div className="wrap page">Loading…</div>

  const back = kindToPath[kind] || '/'

  return (
    <div className="wrap page">
      <article className="article">
        <Link className="meta" to={back}>
          ← {kind}
        </Link>
        <p className="kicker">{item.author_name}</p>
        <h1>{item.title}</h1>
        <p className="lede">{item.summary}</p>
        {item.kind === 'video' && item.media_url && (
          <div className="video-frame" style={{ margin: '1.2rem 0' }}>
            <iframe title={item.title} src={item.media_url} allowFullScreen />
          </div>
        )}
        {item.kind !== 'video' && (item.cover_url || item.media_url) && (
          <img className="cover" src={item.media_url || item.cover_url} alt="" />
        )}
        {item.body && <div className="prose">{item.body}</div>}
        <div className="tags" style={{ marginTop: '1.2rem' }}>
          {(item.tags || []).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </article>
    </div>
  )
}
