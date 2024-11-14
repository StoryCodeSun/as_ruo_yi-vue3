<script setup>
  import useSettingsStore from '@/store/modules/settings'
  import { handleThemeStyle } from '@/utils/theme'
  import { langColumns } from '@/locale'
  import { useLocaleStore } from '@/store/modules/useLocaleStore.js';
  const { language } = storeToRefs(useLocaleStore())
  const locale = computed(() => langColumns.find((item) => item.value === language.value).locale)

  onMounted(() => {
    nextTick(() => {
      // 初始化主题样式
      handleThemeStyle(useSettingsStore().theme)
    })
  })
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
