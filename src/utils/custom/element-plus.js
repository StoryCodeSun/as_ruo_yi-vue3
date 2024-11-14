import { t } from '@/locale'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * @description 轻提示
 * @param {any} option 提示的配置
 * @param {Object} option.message 提示内容
 * @param {Object} option.type 提示类型
 */
export function xmShowHint(option, type = 'warning') {
  if (!option) return
  let config = { type }
  if (typeof option === 'string' && option) {
    config = { message: option, ...config }
  } else {
    config = { ...config, ...option }
  }
  ElMessage(config)
}

/**
 * @description 延迟返回
 * @param {Object} option 返回前展示提示的配置，不传则不展示
 * @param {Object} option.message 提示内容
 * @param {Object} option.type 提示类型
 * @param {Number} time  延迟返回的时间默认800毫秒
 * @example xmPageBack('返回前的提示内容')
 */
export function xmPageBack(option, time = 800) {
  xmShowHint(option)
  setTimeout(() => router.back(), option ? time : 0)
}

/**
 * @description 跳转页面
 * @param {String} url 跳转的地址
 * @param {Object} data 传递的参数
 * @param {String} type 跳转方式
 * @type {1 | 2 } 跳转方式 1：push 2：replace
 * @example xmPageJump('/pages/index/index', {id: 1})
 */
export function xmPageJump(url, data, type = 1) {
  if (!url) return xmShowHint('你要让我去哪儿？')
  const typeMap = {
    1: 'push',
    2: 'replace'
  }

  return new Promise((resolve) => {
    if (/^(http|https):\/\//.test(url)) {
      url += data ? xmQueryParams(data) : ''
      window.location.href = url
      resolve()
    } else {
      router[typeMap[type]]({ path: url, query: data })
      resolve()
    }
  })
}

/**
 * @description 消息弹出窗
 * @param {any} option 消息弹出窗的配置
 * @param {Object} option.title 提示标题
 * @param {Object} option.message 提示内容
 * @param {Object} option.confirmButtonText 确定按钮文字
 * @param {Object} option.cancelButtonText 取消按钮文字
 * @param {Object} option.type 提示类型
 */
export function xmShowHintBox(option) {
  if (!option) return
  let config = {
    title: t('hint'),
    message: '确定要删除吗？',
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }
  if (typeof option === 'string' && option) {
    config = { ...config, message: option }
  } else {
    config = { ...config, ...option }
  }
  const { title, message, confirmButtonText, cancelButtonText, type, center = false } = config
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, title, { confirmButtonText, cancelButtonText, type, center })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}
