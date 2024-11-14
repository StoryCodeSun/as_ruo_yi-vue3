import { getSto } from '@/utils/custom'
import { langColumns, cutLocales } from '@/locale'

export const useLocaleStore = defineStore(
  'localeStore',
  () => {
    const language = ref(getSto('language'))

    const updateLocal = (lang) => {
      language.value = lang
      cutLocales(lang)
    }
    return { language, updateLocal }
  },
  { persist: true }
)
import.meta.hot && import.meta.hot.accept(acceptHMRUpdate(useLocaleStore, import.meta.hot))
