import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, translations } from './translations.js'

const LANG_KEY = 'sc_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'en'
  })

  const setLang = (code) => {
    if (translations[code]) {
      setLangState(code)
      localStorage.setItem(LANG_KEY, code)
    }
  }

  const t = (path) => {
    const keys = path.split('.')
    let curr = translations[lang]
    for (const k of keys) {
      if (!curr) break
      curr = curr[k]
    }
    if (curr !== undefined) return curr

    // Fallback to English
    let fallback = translations['en']
    for (const k of keys) {
      if (!fallback) break
      fallback = fallback[k]
    }
    return fallback !== undefined ? fallback : path
  }

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      languages: LANGUAGES,
    }),
    [lang]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
