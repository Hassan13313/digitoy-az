export default function LanguageSwitcher({ lang, setLang }) {
  const langs = ['az', 'en', 'ru']

  return (
    <div className="flex items-center gap-0 border border-gold/30 overflow-hidden">
      {langs.map((l, i) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 text-xs font-medium tracking-widest uppercase transition-all duration-200 ${
            lang === l
              ? 'bg-gold text-white'
              : 'text-brown-muted hover:text-gold bg-transparent'
          } ${i < langs.length - 1 ? 'border-r border-gold/30' : ''}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
