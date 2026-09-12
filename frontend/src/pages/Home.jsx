import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, cvUrl } from '../api.js'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    api.profile().then(setProfile).catch(() => {})
    api.list('blog').then(setPosts).catch(() => {})
  }, [])

  if (!profile) return <div className="wrap page">Loading…</div>

  return (
    <div className="wrap page">
      <section className="hero">
        <div>
          <p className="kicker">{profile.location} · {profile.title}</p>
          <h1>{profile.name}</h1>
          <p className="lede">{profile.summary}</p>
          <p className="lede">{profile.seeking}</p>
          <div className="row">
            <a className="btn" href={cvUrl}>
              Download CV
            </a>
            <Link className="btn ghost" to="/work">
              See the work
            </Link>
            <a className="btn ghost" href={`mailto:${profile.email}`}>
              Email
            </a>
          </div>
        </div>
        <aside className="hero-aside">
          <p className="kicker" style={{ color: '#c4a574' }}>Now</p>
          <p>
            <strong>PwC India</strong> — Full stack & API / cloud, Fortune 50 and private-equity products.
          </p>
          <p>{profile.phone}</p>
          <p>{profile.email}</p>
          <p>Languages: {profile.languages.join(' · ')}</p>
        </aside>
      </section>

      <section className="section">
        <p className="kicker">Selected craft</p>
        <h2>React, Python, and the unglamorous middle</h2>
        <p className="lede">
          Forecasting tools, bonus engines, ESG math, market-data ETL, and a chat interface on OpenAI —
          shipped for PwC US and PE clients on Azure and AWS.
        </p>
        <div className="skills" style={{ marginTop: '1.2rem' }}>
          {Object.entries(profile.skills).map(([group, items]) => (
            <div className="skill-block" key={group}>
              <h3 style={{ textTransform: 'capitalize' }}>{group}</h3>
              <div className="tags">
                {items.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="kicker">Latest writing</p>
        <h2>From the journal</h2>
        {posts.length === 0 ? (
          <p className="empty">No posts yet — the studio is empty until the first piece is published.</p>
        ) : (
          <div className="grid">
            {posts.slice(0, 3).map((post) => (
              <Link className="card" key={post.id} to={`/blog/${post.id}`}>
                {post.cover_url && <img src={post.cover_url} alt="" />}
                <div className="card-body">
                  <h3>{post.title}</h3>
                  <p className="meta">{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
