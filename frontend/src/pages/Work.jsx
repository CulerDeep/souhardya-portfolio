import { useEffect, useState } from 'react'
import { api, cvUrl } from '../api.js'

export default function Work() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.profile().then(setProfile).catch(() => {})
  }, [])

  if (!profile) return <div className="wrap page">Loading…</div>

  return (
    <div className="wrap page">
      <p className="kicker">Experience</p>
      <h1>Work</h1>
      <p className="lede">
        Full stack consulting since 2022 — React and Angular on the client, Flask/.NET APIs, SQL Server and
        PostgreSQL underneath, Azure and AWS for the rest.
      </p>
      <div className="row">
        <a className="btn" href={cvUrl}>
          Download CV
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
        <p className="kicker">School</p>
        <h2>Education</h2>
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
