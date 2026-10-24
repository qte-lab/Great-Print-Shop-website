import { useEffect, useState } from 'react'
import {
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Printer,
  Sparkles,
  Truck,
} from 'lucide-react'
import './index.css'
import { content, languages, languageCodes, preferredContact, type ContactChannel, type Language } from './locales'

function ContactBrandIcon({ channel, size = 18 }: { channel: ContactChannel; size?: number }) {
  if (channel === 'email') return <Mail size={size} aria-hidden="true" />

  if (channel === 'line') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3.5c-5.1 0-9.2 3.3-9.2 7.5 0 2.4 1.4 4.5 3.7 5.9l-.8 3.2 3.8-1.7c.8.2 1.7.3 2.5.3 5.1 0 9.2-3.4 9.2-7.7S17.1 3.5 12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <text x="12" y="12.7" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="5.2" fontWeight="700" textAnchor="middle">LINE</text>
      </svg>
    )
  }

  if (channel === 'whatsapp') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.2-4.4a8.2 8.2 0 1 1 15.5-3.9Z" />
        <path d="M8.2 7.8c.3-.5.7-.5 1-.1l1.1 1.6c.2.3.1.6-.2.9l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.7c.2-.3.6-.4.9-.2l1.6 1.1c.4.3.4.7.1 1-.5.7-1.3 1.1-2.1 1-3.2-.4-6.1-3.3-6.5-6.5-.1-.7.4-1.5 1.2-1.6Z" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.2 4.1c-4.3 0-7.8 2.8-7.8 6.2 0 1.9 1.1 3.6 2.9 4.8l-.6 2.5 3.1-1.3c.8.2 1.6.3 2.4.3 4.3 0 7.8-2.8 7.8-6.2s-3.5-6.3-7.8-6.3Z" />
      <path d="M16.4 14.6c2.7.2 4.8 1.9 4.8 4 0 1-.5 2-1.4 2.7l.3 1.3-1.8-.8c-.5.1-1 .2-1.5.2-2.8 0-5-1.7-5-3.8" />
      <circle cx="9.1" cy="10.4" r=".45" fill="currentColor" />
      <circle cx="15.1" cy="10.4" r=".45" fill="currentColor" />
      <circle cx="15.4" cy="18.1" r=".35" fill="currentColor" />
      <circle cx="18" cy="18.1" r=".35" fill="currentColor" />
    </svg>
  )
}

function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value)
}

function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem('great-print-shop-language')
    if (stored && isLanguage(stored)) return stored
  } catch {
    // Browser language detection still works when storage is unavailable.
  }

  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const browserLanguage of browserLanguages) {
    const normalized = browserLanguage.toLowerCase().replace('_', '-')
    if (normalized.startsWith('zh')) {
      if (normalized.includes('hk') || normalized.includes('mo')) return 'zh-Hant-HK'
      if (normalized.includes('tw') || normalized.includes('hant')) return 'zh-Hant-TW'
      return 'zh-Hans'
    }
    if (normalized.startsWith('fr')) return 'fr'
    if (normalized.startsWith('ja')) return 'ja'
    if (normalized.startsWith('lo')) return 'lo'
    if (normalized.startsWith('ms')) return 'ms'
    if (normalized.startsWith('my')) return 'my'
    if (normalized.startsWith('th')) return 'th'
    if (normalized.startsWith('en')) return 'en'
  }
  return 'zh-Hans'
}
const serviceItems = [
  { icon: Sparkles, key: 'quality' as const, textKey: 'qualityText' as const },
  { icon: Copy, key: 'value' as const, textKey: 'valueText' as const },
  { icon: Truck, key: 'delivery' as const, textKey: 'deliveryText' as const },
]

function App() {
  const [language, setLanguage] = useState<Language>(detectLanguage)
  const text = content[language]
  const contactChannel = preferredContact[language]
  const contactHref = {
    email: 'mailto:greatprintshop@outlook.com',
    line: 'https://page.line.me/073jmhzj',
    whatsapp: 'https://wa.me/660616648336',
    wechat: 'weixin://',
  }[contactChannel]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = `Great Print Shop · ${text.languageName}`
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', text.metaDescription)
    try {
      localStorage.setItem('great-print-shop-language', language)
    } catch {
      // Ignore unavailable browser storage.
    }
  }, [language, text])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label={text.homeLabel}>
            <span className="brand-mark" aria-hidden="true"><Printer size={20} strokeWidth={2.25} /></span>
            <span className="brand-name">Great Print Shop</span>
            <span className="brand-dot" aria-hidden="true">●</span>
          </a>
          <nav className="desktop-nav" aria-label={text.navigationLabel}>
            <a href="#services">{text.servicesNav}</a>
            <a href="#pricing">{text.pricingNav}</a>
            <a href="#contact">{text.contactNav}</a>
          </nav>
          <div className="header-actions">
            <div className="language-picker">
              <Globe2 size={15} aria-hidden="true" />
              <label htmlFor="language-select" className="sr-only">{text.languageLabel}</label>
              <select id="language-select" value={language} onChange={(event) => {
                if (isLanguage(event.target.value)) setLanguage(event.target.value)
              }}>
                {languages.map((code) => <option key={code} value={code}>{languageCodes[code]} · {content[code].languageName}</option>)}
              </select>
            </div>
            <a className="header-order" href={contactHref} target={contactChannel === 'email' ? undefined : '_blank'} rel={contactChannel === 'email' ? undefined : 'noreferrer'}>
              <span>{text.orderNow}</span><ContactBrandIcon channel={contactChannel} size={17} />
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" />{text.eyebrow}</p>
              <h1>{text.heroTitle}</h1>
              <p className="hero-body">{text.heroBody}</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#pricing">{text.primaryCta}<CircleDollarSign size={17} aria-hidden="true" /></a>
                <a className="text-link" href="#contact">{text.secondaryCta}<MessageCircle size={16} aria-hidden="true" /></a>
              </div>
              <div className="campus-note"><MapPin size={16} aria-hidden="true" /><span>{text.campusNote}</span></div>
            </div>
            <div className="hero-art" aria-label={text.priceLabel}>
              <div className="hero-stamp">{text.heroStamp.map((line) => <span key={line}>{line}</span>)}</div>
              <div className="paper-card">
                <div className="paper-topline"><span>GP / 2026</span><span className="paper-rule" /></div>
                <div className="paper-icon"><Printer size={28} strokeWidth={1.8} /></div>
                <p className="paper-kicker">{text.priceBadge}</p>
                <div className="paper-price"><strong>1</strong><span>฿</span></div>
                <p className="paper-label">{text.priceLabel} <span>{text.perPage}</span></p>
                <div className="paper-footer"><span>SHINAWATRA UNIVERSITY</span><span>01</span></div>
              </div>
              <div className="hero-scribble" aria-hidden="true">{text.heroScribble.map((line) => <span key={line}>{line}</span>)}</div>
            </div>
          </div>
          <div className="hero-ticker" aria-hidden="true"><span>{text.ticker}</span><span>{text.ticker}</span><span>{text.ticker}</span><span>{text.ticker}</span></div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span className="eyebrow-line" />{text.servicesEyebrow}</p><h2>{text.servicesTitle}</h2></div>
            <p>{text.servicesBody}</p>
          </div>
          <div className="service-list">
            {serviceItems.map(({ icon: Icon, key, textKey }, index) => (
              <article className="service-card" key={key}>
                <div className="service-number">0{index + 1}</div>
                <div className="service-icon"><Icon size={25} strokeWidth={1.8} /></div>
                <h3>{text[key]}</h3>
                <p>{text[textKey]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing-section" id="pricing">
          <div className="pricing-heading"><p className="eyebrow"><span className="eyebrow-line" />{text.pricingEyebrow}</p><h2>{text.pricingTitle}</h2><p>{text.pricingBody}</p></div>
          <div className="pricing-layout">
            <div className="pricing-cards">
              <article className="price-card price-card-green"><div className="price-card-top"><span className="price-index">01</span><span className="price-label">A4 / {text.page}</span></div><div className="price-name">{text.blackWhite}</div><div className="price-value"><strong>1</strong><span>฿</span></div><div className="price-unit">{text.perPage}</div></article>
              <article className="price-card price-card-coral"><div className="price-card-top"><span className="price-index">02</span><span className="price-label">A4 / {text.page}</span></div><div className="price-name">{text.color}</div><div className="price-value"><strong>5</strong><span>฿</span></div><div className="price-unit">{text.perPage}</div></article>
            </div>
            <div className="price-aside"><div className="price-aside-mark">✓</div><p>{text.samePrice}</p><div className="dotted-line" /><p className="price-aside-small">A4 · {text.blackWhite} · {text.color}</p></div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-inner">
            <div className="contact-copy"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{text.contactEyebrow}</p><h2>{text.contactTitle}</h2><p>{text.contactBody}</p><a className="button button-light" href={contactHref} target={contactChannel === 'email' ? undefined : '_blank'} rel={contactChannel === 'email' ? undefined : 'noreferrer'}>{text.orderNow}<ContactBrandIcon channel={contactChannel} size={18} /></a></div>
            <div className="contact-links">
              <a className="contact-link" href="mailto:greatprintshop@outlook.com"><span className="contact-icon"><ContactBrandIcon channel="email" /></span><span><small>{text.email}</small><strong>greatprintshop@outlook.com</strong></span><ChevronRight size={17} aria-hidden="true" /></a>
              <a className="contact-link" href="https://page.line.me/073jmhzj" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactBrandIcon channel="line" /></span><span><small>{text.line}</small><strong>@073jmhzj</strong></span><ExternalLink size={15} aria-hidden="true" /></a>
              <a className="contact-link" href="https://wa.me/660616648336" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactBrandIcon channel="whatsapp" /></span><span><small>{text.whatsapp}</small><strong>+66 061 664 8336</strong></span><ExternalLink size={15} aria-hidden="true" /></a>
              <a className="contact-link" href="weixin://" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactBrandIcon channel="wechat" /></span><span><small>{text.wechat}</small><strong>GreatPrintShop</strong></span><ExternalLink size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="section area-section">
          <div className="area-card"><div className="area-illustration" aria-hidden="true"><div className="area-circle" /><div className="area-pin"><MapPin size={30} /></div><span className="area-label area-label-one">{text.onCampus}</span><span className="area-label area-label-two">{text.nearYou}</span></div><div className="area-copy"><p className="eyebrow"><span className="eyebrow-line" />{text.areaEyebrow}</p><h2>{text.areaTitle}</h2><p>{text.areaBody}</p><div className="address-row"><MapPin size={18} /><span>{text.address}</span></div><div className="address-row"><Clock3 size={18} /><span>{text.hours}</span></div></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><span className="brand-mark"><Printer size={18} strokeWidth={2.2} /></span><span>Great Print Shop</span></div><p>{text.footer}</p><a href="#top" className="back-top">↑ <span>{text.backToTop}</span></a></div></footer>
    </div>
  )
}

export default App
