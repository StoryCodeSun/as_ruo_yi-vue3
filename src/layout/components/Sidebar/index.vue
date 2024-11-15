<template>
  <div :class="{ 'has-logo': showLogo }" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path + index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div v-if="!isCollapse" class="xm-drag-line" @mousedown="changeMousedownDragLine"></div>
  </div>
</template>

<script setup>
  import Logo from './Logo'
  import SidebarItem from './SidebarItem'
  import variables from '@/assets/styles/variables.module.scss'
  import useAppStore from '@/store/modules/app'
  import useSettingsStore from '@/store/modules/settings'
  import usePermissionStore from '@/store/modules/permission'

  const route = useRoute()
  const appStore = useAppStore()
  const settingsStore = useSettingsStore()
  const permissionStore = usePermissionStore()

  const sidebarRouters = computed(() => permissionStore.sidebarRouters)
  const showLogo = computed(() => settingsStore.sidebarLogo)
  const sideTheme = computed(() => settingsStore.sideTheme)
  const theme = computed(() => settingsStore.theme)
  const isCollapse = computed(() => !appStore.sidebar.opened)

  const activeMenu = computed(() => {
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  })
  // ======
  const emit = defineEmits(['changeDragLineWidth'])
  const isPress = ref(false)
  const oldWidth = ref(null)
  const changeMousedownDragLine = (e) => {
    oldWidth.value = e.clientX
    e.preventDefault()
    isPress.value = true
  }
  const changeMousemoveDragLine = (e) => {
    if (!isPress.value) return
    const width = e.clientX > oldWidth.value ? e.clientX : e.clientX
    oldWidth.value = e.clientX
    if (width > 400 || width < 200) return
    setSto('dragLineWidth', e.clientX)
    emit('changeDragLineWidth', width)
  }
  const changeMouseupDragLine = (e) => {
    isPress.value = false
  }
  onMounted(() => {
    window.addEventListener('mousemove', changeMousemoveDragLine)
    window.addEventListener('mouseup', changeMouseupDragLine)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', changeMousemoveDragLine)
    window.removeEventListener('mouseup', changeMouseupDragLine)
  })
  // ======
</script>
<style lang="scss" scoped>
  .xm-drag-line {
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 80px;
    cursor: col-resize;
    border-left: 2px solid var(--el-color-primary);
    border-right: 2px solid var(--el-color-primary);

    /* 阴影 */
    box-shadow: 1px 0 0 rgba(0, 21, 41, 0.35);
  }
</style>
