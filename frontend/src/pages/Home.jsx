import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, cvUrl } from '../api.js'
import { useLanguage } from '../LanguageContext.jsx'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const { t } = useLanguage()

  useEffect(() => {
    api.profile().then(setProfile).catch(() => {})
    api.list('blog').then(setPosts).catch(() => {})
  }, [])

  if (!profile) return <div className="wrap page">{t('common.loading')}</div>

  return (
    <div className="wrap page">
      <section className="hero">
        <div>
          <p className="kicker">{t('home.location_title')}</p>
          <h1>{t('common.brand_name')}</h1>
          <p className="lede">{t('home.hero_summary')}</p>
          <p className="lede">{t('home.hero_seeking')}</p>
          <div className="row">
            <a className="btn" href={cvUrl}>
              {t('home.download_cv')}
            </a>
            <Link className="btn ghost" to="/work">
              {t('home.see_work')}
            </Link>
            <a className="btn ghost" href={`mailto:${profile.email}`}>
              {t('home.email')}
            </a>
          </div>
        </div>
        <aside className="hero-aside">
          <p className="kicker" style={{ color: '#c4a574' }}>{t('home.now_kicker')}</p>
          <p>
            <strong>{t('home.now_company')}</strong> — {t('home.now_desc')}
          </p>
          <p>{profile.phone}</p>
          <p>{profile.email}</p>
          <p>{t('home.languages_label')}: {profile.languages.join(' · ')}</p>
        </aside>
      </section>

      <section className="section">
        <p className="kicker">{t('home.selected_craft')}</p>
        <h2>{t('home.craft_title')}</h2>
        <p className="lede">
          {t('home.craft_desc')}
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
        <p className="kicker">{t('home.latest_writing')}</p>
        <h2>{t('home.from_journal')}</h2>
        {posts.length === 0 ? (
          <p className="empty">{t('home.no_posts')}</p>
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
