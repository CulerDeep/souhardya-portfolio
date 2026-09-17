import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useLanguage } from '../LanguageContext.jsx'

const empty = {
  kind: 'blog',
  title: '',
  summary: '',
  body: '',
  cover_url: '',
  media_url: '',
  tags: '',
  published: true,
}

export default function Editor() {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (!id) return
    api.get(id).then((item) => {
      setForm({
        kind: item.kind,
        title: item.title,
        summary: item.summary || '',
        body: item.body || '',
        cover_url: item.cover_url || '',
        media_url: item.media_url || '',
        tags: (item.tags || []).join(', '),
        published: item.published,
      })
    })
  }, [id])

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    try {
      if (id) {
        const { kind, ...rest } = payload
        await api.update(id, rest)
      } else {
        await api.create(payload)
      }
      nav('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="wrap page">
      <form className="editor" onSubmit={onSubmit}>
        <p className="kicker">{t('nav.studio')}</p>
        <h1>{id ? t('admin.edit_piece') : t('admin.new_piece')}</h1>
        <label>{t('admin.kind')}</label>
        <select value={form.kind} onChange={(e) => set('kind', e.target.value)} disabled={Boolean(id)}>
          <option value="blog">Blog</option>
          <option value="lesson">Lesson</option>
          <option value="photo">Photograph</option>
          <option value="video">Video</option>
        </select>
        <label>{t('admin.title')}</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
        <label>Summary</label>
        <input value={form.summary} onChange={(e) => set('summary', e.target.value)} />
        <label>Cover image URL</label>
        <input value={form.cover_url} onChange={(e) => set('cover_url', e.target.value)} placeholder="https://…" />
        <label>{form.kind === 'video' ? 'Embed URL (YouTube / Vimeo iframe src)' : 'Media URL'}</label>
        <input value={form.media_url} onChange={(e) => set('media_url', e.target.value)} />
        <label>Body</label>
        <textarea value={form.body} onChange={(e) => set('body', e.target.value)} />
        <label>Tags (comma separated)</label>
        <input value={form.tags} onChange={(e) => set('tags', e.target.value)} />
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set('published', e.target.checked)}
            style={{ width: 'auto', marginRight: '0.45rem' }}
          />
          {t('admin.published')}
        </label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? t('common.loading') : t('admin.save')}
          </button>
          <button className="btn ghost" type="button" onClick={() => nav('/admin')}>
            {t('admin.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
