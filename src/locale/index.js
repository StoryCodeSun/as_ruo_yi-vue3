import { getSto, setSto } from '@/utils/custom'
import { createI18n } from 'vue-i18n'
import enUsCollect from './module/en-us-collect' // 英语
import zhCnCollect from './module/zh-cn-collect' // 简体中文

// Day.js区域设置： https://element-plus.org/zh-CN/guide/i18n.html
// ELEMENT-PLUS 语言包
// 更多语言：
// https://github.com/element-plus/element-plus/tree/dev/packages/locale/lang
// https://element-plus.org/zh-CN/guide/i18n.html
import enUSE from 'element-plus/dist/locale/en.mjs'
import zhCNE from 'element-plus/dist/locale/zh-cn.mjs'

// 获取浏览器的语言
// const userLanguage = navigator.language || navigator.userLanguage
// if (!getSto('language')) setSto('language', userLanguage ?? 'en-US')
if (!getSto('language')) setSto('language', 'en-US')

let i18nConfig = {
  locale: getSto('language'),
  globalInjection: true,
  messages: {
    'en-US': { ...enUsCollect, ...enUSE },
    'zh-CN': { ...zhCnCollect, ...zhCNE },
  },
}

const i18n = createI18n(i18nConfig)
export const t = i18n.global.t

export const langColumns = [
  { text: 'Chinese', locale: zhCNE, value: 'zh-CN' },
  { text: 'English', locale: enUSE, value: 'en-US' },
]

/**
 * 切换语言
 * @param {("en-US"|"zh-CN"|"zh-HK")} lang 语言可选项
 * @returns {void}
 * @example 调用示例
 * cutLocales('en-US');
 */
export function cutLocales(lang) {
  i18n.global.locale = lang
  setSto('language', lang)
  location.reload()
}
export default i18n
