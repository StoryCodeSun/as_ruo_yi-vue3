<template>
  <div>
    <div v-if="VITE_MENUS_TYPE == 'default'" :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
      <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <div id="sidebar-box" v-if="!sidebar.hide" class="sidebar-container">
        <sidebar ref="sidebarRef" @changeDragLineWidth="changeDragLineWidth" />
      </div>
      <div
        id="main-container-box"
        :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }"
        class="main-container"
        :style="{ marginLeft: dragLineWidth }"
      >
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar @setLayout="setLayout" />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <settings ref="settingRef" />
      </div>
    </div>
    <div v-else-if="VITE_MENUS_TYPE == 'xmCustom'">
      <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <div>
        <XMSidebar v-if="!sidebar.hide" class="sidebar-container" />
        <div>
          <XMNavbar @setLayout="setLayout" />
          <tags-view v-if="needTagsView" />
          <XMAppMain />
        </div>
      </div>
      <XMSettings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
  import Cookies from 'js-cookie'
  const { VITE_MENUS_TYPE } = import.meta.env
  import { useWindowSize } from '@vueuse/core'
  import Sidebar from './components/Sidebar/index.vue'
  import XMSidebar from './components/XMSidebar/index.vue'
  import { AppMain, Navbar, Settings, TagsView, XMAppMain, XMNavbar, XMSettings } from './components'
  import defaultSettings from '@/settings'

  import useAppStore from '@/store/modules/app'
  import useSettingsStore from '@/store/modules/settings'

  const settingsStore = useSettingsStore()
  const theme = computed(() => settingsStore.theme)
  const sideTheme = computed(() => settingsStore.sideTheme)
  const sidebar = computed(() => useAppStore().sidebar)
  const device = computed(() => useAppStore().device)
  const needTagsView = computed(() => settingsStore.tagsView)
  const fixedHeader = computed(() => settingsStore.fixedHeader)

  const classObj = computed(() => ({
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device.value === 'mobile',
  }))

  const { width, height } = useWindowSize()
  const WIDTH = 992 // refer to Bootstrap's responsive design

  watch(
    () => device.value,
    () => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        useAppStore().closeSideBar({ withoutAnimation: false })
      }
    }
  )

  nextTick(() => {
    watchEffect(() => {
      if (width.value - 1 < WIDTH) {
        useAppStore().toggleDevice('mobile')
        useAppStore().closeSideBar({ withoutAnimation: true })
        remSto('dragLineWidth')
        document.querySelector('#main-container-box').style.marginLeft = '0px'
      } else {
        useAppStore().toggleDevice('desktop')
        const w = sidebar.value.opened ? getSto('dragLineWidth') || 200 : 54
        changeDragLineWidth(w)
      }
    })
  })

  function handleClickOutside() {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }

  const settingRef = ref(null)
  function setLayout() {
    settingRef.value.openSetting()
  }
  // ======
  const sidebarRef = ref()
  const changeDragLineWidth = (w) => {
    document.querySelector('#sidebar-box')?.style.setProperty('width', `${w}px`, 'important')
    document.querySelector('#main-container-box').style.marginLeft = `${w}px`
  }
  const dragLineWidth = computed(() => {
    const webPhoneW = document.body.clientWidth < 992 ? `0px` : '54px'
    const w = getSto('dragLineWidth') || 200
    return sidebar.value.opened ? `${w}px` : webPhoneW
  })
  // ======
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/mixin.scss';
  @import '@/assets/styles/variables.module.scss';

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px) !important;
  }

  .sidebarHide .fixed-header {
    width: 100%;
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
