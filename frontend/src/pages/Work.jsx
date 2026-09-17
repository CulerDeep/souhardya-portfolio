import { useEffect, useState } from 'react'
import { api, cvUrl } from '../api.js'
import { useLanguage } from '../LanguageContext.jsx'

export default function Work() {
  const [profile, setProfile] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    api.profile().then(setProfile).catch(() => {})
  }, [])

  if (!profile) return <div className="wrap page">{t('common.loading')}</div>

  return (
    <div className="wrap page">
      <p className="kicker">{t('work.kicker')}</p>
      <h1>{t('work.title')}</h1>
      <p className="lede">
        {t('work.lede')}
      </p>
      <div className="row">
        <a className="btn" href={cvUrl}>
          {t('work.download_cv')}
        </a>
      </div>
      <div className="timeline section">
        {profile.experience.map((job) => (
          <article className="job" key={`${job.org}-${job.role}-${job.when}`}>
            <div>
              <p className="meta">{job.when}</p>
              <p className="meta">{job.place}</p>
            </div>
            <div>
              <h2>{job.role}</h2>
              <p>
                <strong>{job.org}</strong>
              </p>
              <ul>
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <section className="section">
        <p className="kicker">{t('work.school_kicker')}</p>
        <h2>{t('work.education_title')}</h2>
        <div className="grid">
          {profile.education.map((ed) => (
            <div className="card" key={ed.school}>
              <div className="card-body">
                <h3>{ed.school}</h3>
                <p className="meta">
                  {ed.credential} · {ed.when}
                </p>
                <p>{ed.detail}</p>
                <p className="meta">{ed.place}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
