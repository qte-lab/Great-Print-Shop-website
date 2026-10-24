import en from './en.json'
import fr from './fr.json'
import ja from './ja.json'
import lo from './lo.json'
import ms from './ms.json'
import my from './my.json'
import th from './th.json'
import zhHans from './zh-Hans.json'
import zhHk from './zh-Hant-HK.json'
import zhTw from './zh-Hant-TW.json'

export const languages = ['en', 'fr', 'ja', 'lo', 'ms', 'my', 'th', 'zh-Hans', 'zh-Hant-HK', 'zh-Hant-TW'] as const

export type Language = (typeof languages)[number]
export type Content = typeof en
export type ContactChannel = 'email' | 'line' | 'whatsapp' | 'wechat'

export const content: Record<Language, Content> = {
  en,
  fr,
  ja,
  lo,
  ms,
  my,
  th,
  'zh-Hans': zhHans,
  'zh-Hant-HK': zhHk,
  'zh-Hant-TW': zhTw,
}

export const languageCodes: Record<Language, string> = {
  en: 'EN',
  fr: 'FR',
  ja: 'JA',
  lo: 'LO',
  ms: 'MS',
  my: 'MY',
  th: 'TH',
  'zh-Hans': 'CN',
  'zh-Hant-HK': 'HK',
  'zh-Hant-TW': 'TW',
}

export const preferredContact: Record<Language, ContactChannel> = {
  en: 'email',
  fr: 'email',
  ja: 'line',
  lo: 'whatsapp',
  ms: 'whatsapp',
  my: 'whatsapp',
  th: 'line',
  'zh-Hans': 'wechat',
  'zh-Hant-HK': 'whatsapp',
  'zh-Hant-TW': 'line',
}
