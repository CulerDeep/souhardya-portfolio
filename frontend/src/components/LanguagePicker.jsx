import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../LanguageContext.jsx'

export default function LanguagePicker() {
  const { lang, setLang, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const activeLang = languages.find((l) => l.code === lang) || languages[0]

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="lang-picker" ref={containerRef}>
      <button
        type="button"
        className={`lang-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Select Language"
        title="Select Language"
      >
        <svg
          className="globe-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        <span className="lang-code">{activeLang.label}</span>
        <svg
          className={`chevron-icon ${open ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`lang-option ${l.code === lang ? 'selected' : ''}`}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
            >
              <span className="lang-option-label">{l.label}</span>
              <span className="lang-option-name">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
