import enUS from './en-US.json'

const localeModules = import.meta.glob<Content>('./*.json', {
  eager: true,
  import: 'default',
})

export type Language = string
export type Content = typeof enUS
export type ContactChannel = 'email' | 'line' | 'whatsapp' | 'wechat'

export const content: Record<Language, Content> = Object.fromEntries(
  Object.entries(localeModules).map(([path, locale]) => [
    path.slice(2, -5),
    locale,
  ]),
)

export const languages = Object.keys(content).sort((a, b) => a.localeCompare(b))

const lineLanguages = new Set(['ja-JP', 'th-TH', 'zh-Hant-TW'])
const wechatLanguages = new Set(['zh-Hans-CN'])
const whatsappLanguages = new Set([
  'ar-SO',
  'de-DE',
  'dz-BT',
  'en-AU',
  'en-CA',
  'en-GB',
  'en-IN',
  'en-PH',
  'en-SG',
  'en-US',
  'fr-CA',
  'hi-IN',
  'ko-KR',
  'lo-LA',
  'ms-MY',
  'ms-SG',
  'my-MM',
  'ne-NP',
  'so-SO',
  'ta-SG',
  'tl-PH',
  'vi-VN',
  'zh-Hans-SG',
  'zh-Hant-HK',
])

export const preferredContact: Record<Language, ContactChannel> = Object.fromEntries(
  languages.map((language) => {
    const channel = lineLanguages.has(language)
      ? 'line'
      : wechatLanguages.has(language)
        ? 'wechat'
        : whatsappLanguages.has(language)
          ? 'whatsapp'
          : 'email'
    return [language, channel]
  }),
)

export function isLanguage(value: string): value is Language {
  return Object.prototype.hasOwnProperty.call(content, value)
}

export function matchLanguage(locale: string): Language | undefined {
  const normalized = locale.toLowerCase().replace(/_/g, '-')
  const exactMatch = languages.find((language) => language.toLowerCase() === normalized)
  if (exactMatch) return exactMatch

  const languageCode = normalized.split('-')[0]
  if (languageCode === 'zh') {
    const script = normalized.includes('hant') || /-(hk|mo|tw)(-|$)/.test(normalized)
      ? 'zh-Hant'
      : 'zh-Hans'
    return languages.find((language) => language.startsWith(script))
      ?? languages.find((language) => language.toLowerCase().startsWith('zh-'))
  }

  const preferredRegions: Record<string, string> = {
    en: 'en-US',
    fr: 'fr-CA',
    ja: 'ja-JP',
    lo: 'lo-LA',
    ms: 'ms-MY',
    my: 'my-MM',
    th: 'th-TH',
  }
  const preferred = preferredRegions[languageCode]
  return (preferred && languages.find((language) => language.toLowerCase() === preferred.toLowerCase()))
    ?? languages.find((language) => language.toLowerCase().startsWith(`${languageCode}-`))
}

export function isRightToLeft(language: Language): boolean {
  return language.startsWith('ar-') || language.startsWith('fa-')
}
