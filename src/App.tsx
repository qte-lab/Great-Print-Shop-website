import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronDown,
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
import {
  content,
  isLanguage,
  isRightToLeft,
  languages,
  matchLanguage,
  preferredContact,
  type ContactChannel,
  type Language,
} from './locales'

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

function LanguagePicker({
  language,
  onChange,
  languageLabel,
}: {
  language: Language
  onChange: (language: Language) => void
  languageLabel: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [opensAbove, setOpensAbove] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setIsClosing(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const updateMenuPosition = () => {
      const bounds = triggerRef.current?.getBoundingClientRect()
      if (!bounds) return
      const isMobile = window.matchMedia('(max-width: 600px)').matches
      const width = Math.min(isMobile ? 320 : 360, window.innerWidth - 24)
      const preferredHeight = Math.min(window.innerHeight * (isMobile ? 0.32 : 0.65), isMobile ? 280 : 560)
      const spaceBelow = window.innerHeight - bounds.bottom - 20
      const spaceAbove = bounds.top - 20
      const openAbove = spaceBelow < Math.min(preferredHeight, 240) && spaceAbove > spaceBelow
      const availableSpace = openAbove ? spaceAbove : spaceBelow
      const maxHeight = Math.max(120, Math.min(preferredHeight, availableSpace))

      setOpensAbove(openAbove)
      setMenuStyle({
        position: 'fixed',
        top: openAbove ? Math.max(12, bounds.top - maxHeight - 8) : bounds.bottom + 8,
        left: Math.max(12, Math.min(bounds.right - width, window.innerWidth - width - 12)),
        width,
        maxHeight,
      })
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Node &&
        !pickerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        closeMenu()
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus({ preventScroll: true })
      }
    }

    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    const focusFrame = window.requestAnimationFrame(() => {
      const menu = menuRef.current
      const selectedOption = menu?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
      if (!menu || !selectedOption) return
      selectedOption.focus({ preventScroll: true })
      menu.scrollTop = Math.max(0, selectedOption.offsetTop - (menu.clientHeight - selectedOption.offsetHeight) / 2)
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen, closeMenu])

  const focusOption = (index: number) => {
    const options = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    if (!options?.length) return
    const option = options[(index + options.length) % options.length]
    option.focus({ preventScroll: true })
    const menu = menuRef.current
    if (menu && option.offsetTop < menu.scrollTop) {
      menu.scrollTop = option.offsetTop
    } else if (menu && option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight
    }
  }

  return (
    <>
      <div className="language-picker" ref={pickerRef}>
        <button
          ref={triggerRef}
          className="language-picker-trigger"
          type="button"
          aria-label={`${languageLabel}: ${language}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="language-options"
          onClick={() => {
            if (isOpen) {
              closeMenu()
            } else {
              setIsClosing(false)
              setIsOpen(true)
            }
          }}
        >
          <Globe2 size={15} aria-hidden="true" />
          <span className="language-picker-label" dir="ltr">{language}</span>
          <ChevronDown className="language-picker-chevron" size={14} aria-hidden="true" />
        </button>
      </div>
      {isOpen && createPortal(
        <div
          id="language-options"
          className={`language-picker-menu${isClosing ? ' is-closing' : ''}${opensAbove ? ' opens-above' : ''}`}
          role="listbox"
          aria-label={languageLabel}
          aria-hidden={isClosing}
          ref={menuRef}
          style={menuStyle}
          onAnimationEnd={(event) => {
            if (event.target !== event.currentTarget || !isClosing) return
            setIsOpen(false)
            setIsClosing(false)
          }}
          onKeyDown={(event) => {
            const target = event.target
            const optionCode = target instanceof HTMLButtonElement
              ? target.dataset.language
              : undefined
            const currentIndex = languages.indexOf(optionCode ?? language)
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              focusOption(currentIndex + 1)
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              focusOption(currentIndex - 1)
            } else if (event.key === 'Home') {
              event.preventDefault()
              focusOption(0)
            } else if (event.key === 'End') {
              event.preventDefault()
              focusOption(languages.length - 1)
            }
          }}
        >
          {languages.map((code) => {
            const rtl = isRightToLeft(code)
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={code === language}
                data-language={code}
                className="language-picker-option"
                onClick={() => {
                  onChange(code)
                  closeMenu()
                  triggerRef.current?.focus({ preventScroll: true })
                }}
              >
                <span className="language-picker-option-code" dir="ltr">{code}</span>
                <span
                  className={`language-picker-option-name${rtl ? ' is-rtl' : ''}`}
                  lang={code}
                  dir={rtl ? 'rtl' : 'auto'}
                >
                  {content[code].languageName}
                </span>
              </button>
            )
          })}
        </div>,
        document.body,
      )}
    </>
  )
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
    const language = matchLanguage(browserLanguage)
    if (language) return language
  }
  return matchLanguage('zh-Hans-CN') ?? languages[0]
}
const serviceItems = [
  { icon: Sparkles, key: 'quality' as const, textKey: 'qualityText' as const },
  { icon: Copy, key: 'value' as const, textKey: 'valueText' as const },
  { icon: Truck, key: 'delivery' as const, textKey: 'deliveryText' as const },
]

function App() {
  const [language, setLanguage] = useState<Language>(detectLanguage)
  const [isPageEntering, setIsPageEntering] = useState(true)
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)
  const previousLanguage = useRef(language)
  const text = content[language]
  const rtl = isRightToLeft(language)
  const footerSeparatorIndex = text.footer.indexOf(' · ')
  const footerAttribution = footerSeparatorIndex >= 0
    ? text.footer.slice(0, footerSeparatorIndex)
    : undefined
  const footerNotice = footerSeparatorIndex >= 0
    ? text.footer.slice(footerSeparatorIndex + 3)
    : undefined
  const contactChannel = preferredContact[language]
  const contactHref = {
    email: 'mailto:greatprintshop@outlook.com',
    line: 'https://page.line.me/073jmhzj',
    whatsapp: 'https://wa.me/660616648336',
    wechat: 'weixin://',
  }[contactChannel]

  useEffect(() => {
    const pageTitle = `Great Print Shop | ${text.heroTitle}`
    document.documentElement.lang = language
    document.documentElement.dir = isRightToLeft(language) ? 'rtl' : 'ltr'
    document.title = pageTitle
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', text.metaDescription)
    }
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', pageTitle)
    }
    try {
      localStorage.setItem('great-print-shop-language', language)
    } catch {
      // Ignore unavailable browser storage.
    }
  }, [language, text])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsPageEntering(false), 700)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (previousLanguage.current === language) return
    previousLanguage.current = language
    setIsPageEntering(false)
    setIsLanguageChanging(true)
    const timeoutId = window.setTimeout(() => setIsLanguageChanging(false), 420)
    return () => window.clearTimeout(timeoutId)
  }, [language])

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>('.scroll-reveal')
    const showAll = () => revealTargets.forEach((element) => element.classList.add('is-visible'))

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      showAll()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      })
    }, {
      threshold: 0.08,
      rootMargin: '-4% 0px -4% 0px',
    })

    revealTargets.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (language !== 'lzh') return
    const scroller = document.querySelector<HTMLElement>('.app-shell')
    if (!scroller) return

    // Pin the strip to 卷首 (rightmost panel = hero) on entry. The RTL strip
    // must start at scrollLeft 0 (right edge / header); without this, scroll
    // anchoring or hash restoration can drop the user into the middle.
    scroller.scrollLeft = 0

    const scrollHorizontally = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      const target = event.target
      const section = target instanceof Element
        ? target.closest<HTMLElement>('main > section')
        : null
      const canScrollSection = section
        && section.scrollHeight > section.clientHeight
        && ((event.deltaY < 0 && section.scrollTop > 0)
          || (event.deltaY > 0 && section.scrollTop + section.clientHeight < section.scrollHeight))

      if (canScrollSection) {
        event.preventDefault()
        section.scrollTop += event.deltaY
        return
      }

      // Horizontal strip scroller (RTL div): wheel down advances leftward, i.e.
      // scrollLeft decreases below 0.
      event.preventDefault()
      scroller.scrollLeft -= event.deltaY
    }

    // In lzh mode the page scrolls horizontally (RTL). The default anchor
    // behaviour for href="#top" only resets scrollTop, which is already 0 —
    // so intercept clicks on any #top link and reset scrollLeft to 0 (the
    // rightmost panel = hero/卷首 in RTL).
    const handleBackToTop = (event: MouseEvent) => {
      const target = event.target
      const anchor = target instanceof Element
        ? target.closest<HTMLAnchorElement>('a[href="#top"]')
        : null
      if (!anchor) return
      event.preventDefault()
      scroller.scrollLeft = 0
    }

    window.addEventListener('wheel', scrollHorizontally, { passive: false })
    document.addEventListener('click', handleBackToTop)
    return () => {
      window.removeEventListener('wheel', scrollHorizontally)
      document.removeEventListener('click', handleBackToTop)
    }
  }, [language])

  return (
    <div className={`app-shell${isPageEntering ? ' page-entering' : ''}${isLanguageChanging ? ' language-changing' : ''}`}>
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
            <LanguagePicker language={language} onChange={setLanguage} languageLabel={text.languageLabel} />
            <a className="header-order" href={contactHref} target={contactChannel === 'email' ? undefined : '_blank'} rel={contactChannel === 'email' ? undefined : 'noreferrer'}>
              <span>{text.orderNow}</span><ContactBrandIcon channel={contactChannel} size={17} />
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy scroll-reveal">
              <p className="eyebrow"><span className="eyebrow-line" />{text.eyebrow}</p>
              <h1>{text.heroTitle}</h1>
              <p className="hero-body">{text.heroBody}</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#pricing">{text.primaryCta}<CircleDollarSign size={17} aria-hidden="true" /></a>
                <a className="text-link" href="#contact">{text.secondaryCta}<MessageCircle size={16} aria-hidden="true" /></a>
              </div>
              <div className="campus-note"><MapPin size={16} aria-hidden="true" /><span>{text.campusNote}</span></div>
            </div>
            <div className="hero-art scroll-reveal" aria-label={text.priceLabel}>
              <div className="hero-stamp">{text.heroStamp.map((line) => <span key={line}>{line}</span>)}</div>
              <div className="paper-card">
                <div className="paper-topline"><span dir="ltr">GP / 2026</span><span className="paper-rule" /></div>
                <div className="paper-icon"><Printer size={28} strokeWidth={1.8} /></div>
                <p className="paper-kicker">{text.priceBadge}</p>
                <div className="paper-price"><bdi dir="ltr"><strong>1</strong></bdi><span>฿</span></div>
                <p className="paper-label"><bdi>{text.priceLabel}</bdi> <span dir="auto">{text.perPage}</span></p>
                <div className="paper-footer"><span dir="ltr">SHINAWATRA UNIVERSITY</span><span dir="ltr">01</span></div>
              </div>
              <div className="hero-scribble" aria-hidden="true">{text.heroScribble.map((line) => <span key={line}>{line}</span>)}</div>
            </div>
          </div>
          <div className="hero-ticker scroll-reveal" aria-hidden="true"><span>{text.ticker}</span><span>{text.ticker}</span><span>{text.ticker}</span><span>{text.ticker}</span></div>
        </section>

        <section className="section services-section scroll-reveal" id="services">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span className="eyebrow-line" />{text.servicesEyebrow}</p><h2>{text.servicesTitle}</h2></div>
            <p>{text.servicesBody}</p>
          </div>
          <div className="service-list">
            {serviceItems.map(({ icon: Icon, key, textKey }, index) => (
              <article className="service-card scroll-reveal" key={key}>
                <div className="service-number">0{index + 1}</div>
                <div className="service-icon"><Icon size={25} strokeWidth={1.8} /></div>
                <h3>{text[key]}</h3>
                <p>{text[textKey]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section pricing-section scroll-reveal" id="pricing">
          <div className="pricing-heading"><p className="eyebrow"><span className="eyebrow-line" />{text.pricingEyebrow}</p><h2>{text.pricingTitle}</h2><p>{text.pricingBody}</p></div>
          <div className="pricing-layout">
            <div className="pricing-cards">
              <article className="price-card price-card-green scroll-reveal"><div className="price-card-top"><span className="price-index" dir="ltr">01</span><span className="price-label" dir="ltr">A4 / <bdi>{text.page}</bdi></span></div><div className="price-name">{text.blackWhite}</div><div className="price-value"><bdi dir="ltr"><strong>1</strong></bdi><span>฿</span></div><div className="price-unit">{text.perPage}</div></article>
              <article className="price-card price-card-coral scroll-reveal"><div className="price-card-top"><span className="price-index" dir="ltr">02</span><span className="price-label" dir="ltr">A4 / <bdi>{text.page}</bdi></span></div><div className="price-name">{text.color}</div><div className="price-value"><bdi dir="ltr"><strong>5</strong></bdi><span>฿</span></div><div className="price-unit">{text.perPage}</div></article>
            </div>
            <div className="price-aside scroll-reveal"><div className="price-aside-mark">✓</div><p>{text.samePrice}</p><div className="dotted-line" /><p className="price-aside-small" dir="auto"><bdi dir="ltr">A4</bdi> · {text.blackWhite} · {text.color}</p></div>
          </div>
        </section>

        <section className="contact-section scroll-reveal" id="contact">
          <div className="contact-inner">
            <div className="contact-copy scroll-reveal"><p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{text.contactEyebrow}</p><h2>{text.contactTitle}</h2><p>{text.contactBody}</p><a className="button button-light" href={contactHref} target={contactChannel === 'email' ? undefined : '_blank'} rel={contactChannel === 'email' ? undefined : 'noreferrer'}>{text.orderNow}<ContactBrandIcon channel={contactChannel} size={18} /></a></div>
            <div className="contact-links">
              <a className="contact-link scroll-reveal" href="mailto:greatprintshop@outlook.com"><span className="contact-icon"><ContactBrandIcon channel="email" /></span><span><small>{text.email}</small><strong dir="ltr">greatprintshop@outlook.com</strong></span><ChevronRight size={17} aria-hidden="true" /></a>
              <a className="contact-link scroll-reveal" href="https://page.line.me/073jmhzj" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactBrandIcon channel="line" /></span><span><small>{text.line}</small><strong dir="ltr">@073jmhzj</strong></span><ExternalLink size={15} aria-hidden="true" /></a>
              <a className="contact-link scroll-reveal" href="https://wa.me/660616648336" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactBrandIcon channel="whatsapp" /></span><span><small>{text.whatsapp}</small><strong dir="ltr">+66 061 664 8336</strong></span><ExternalLink size={15} aria-hidden="true" /></a>
              <a className="contact-link scroll-reveal" href="weixin://" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactBrandIcon channel="wechat" /></span><span><small>{text.wechat}</small><strong dir="ltr">GreatPrintShop</strong></span><ExternalLink size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="section area-section scroll-reveal">
          <div className="area-card"><div className="area-illustration" aria-hidden="true"><div className="area-circle" /><div className="area-pin"><MapPin size={30} /></div><span className="area-label area-label-one">{text.onCampus}</span><span className="area-label area-label-two">{text.nearYou}</span></div><div className="area-copy"><p className="eyebrow"><span className="eyebrow-line" />{text.areaEyebrow}</p><h2>{text.areaTitle}</h2><p>{text.areaBody}</p><div className="address-row"><MapPin size={18} /><span>{text.address}</span></div><div className="address-row"><Clock3 size={18} /><span>{text.hours}</span></div></div></div>
        </section>
      </main>

      <footer className="site-footer scroll-reveal"><div className="footer-inner"><div className="footer-brand"><span className="brand-mark"><Printer size={18} strokeWidth={2.2} /></span><span dir="ltr">Great Print Shop</span></div><p>{footerAttribution !== undefined && footerNotice !== undefined ? <><bdi dir="ltr">{rtl ? `· ${footerAttribution}` : `${footerAttribution} ·`}</bdi>{' '}<span>{footerNotice}</span></> : text.footer}</p><a href="#top" className="back-top">↑ <span>{text.backToTop}</span></a></div></footer>
    </div>
  )
}

export default App
