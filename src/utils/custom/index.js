/**
 * 存
 * @param {String} key 键
 * @param {Any} value 值
 */
export function setSto(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 取
 * @param {String} key 键
 */
export function getSto(key) {
  let stoData = localStorage.getItem(key)
  try {
    return JSON.parse(stoData)
  } catch (error) {
    return stoData
  }
}

/**
 * 删除
 * @param {String} key 键
 */
export function remSto(key) {
  localStorage.removeItem(key)
}

/**
 * 清空
 */
export function clearSto() {
  localStorage.clear()
}

/**
 * 静态文件引入
 * @param {String} url 地址
 * @returns 拼接后地址
 * @example 调用示例
 * importFile('image/xxx')
 */
export function xmImportFile(url) {
  return new URL(`../assets/${url}`, import.meta.url).href
}

let timeout = null
/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function xmDebounce(func, wait = 500, immediate = false) {
  // 清除定时器
  if (timeout !== null) clearTimeout(timeout)
  // 立即执行，此类情况一般用不到
  if (immediate) {
    const callNow = !timeout
    timeout = setTimeout(() => {
      timeout = null
    }, wait)
    if (callNow) typeof func === 'function' && func()
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timeout = setTimeout(() => {
      typeof func === 'function' && func()
    }, wait)
  }
}

let flag
let timer
/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function xmThrottle(func, wait = 500, immediate = true) {
  if (immediate) {
    if (!flag) {
      flag = true
      // 如果是立即执行，则在wait毫秒内开始时执行
      typeof func === 'function' && func()
      timer = setTimeout(() => {
        flag = false
      }, wait)
    }
  } else if (!flag) {
    flag = true
    // 如果是非立即执行，则在wait毫秒内的结束处执行
    timer = setTimeout(() => {
      flag = false
      typeof func === 'function' && func()
    }, wait)
  }
}

/**
 * 获取当前眠月日时分秒周几
 * @returns {object} 年月日时分秒周几
 */
export function getDateTime() {
  function formatNumber(number) {
    return number < 10 ? '0' + number : number
  }
  const now = new Date()
  const year = now.getFullYear()
  const month = formatNumber(now.getMonth() + 1)
  const day = formatNumber(now.getDate())
  const hours = formatNumber(now.getHours())
  const minutes = formatNumber(now.getMinutes())
  const seconds = formatNumber(now.getSeconds())
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekdayIndex = now.getDay()
  const currentWeekday = weekdays[weekdayIndex]
  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    currentWeekday
  }
}

/**
 * @description 对象转url参数
 * @param {object} data,对象
 * @param {Boolean} isPrefix,是否自动加上"?"
 * @param {string} arrayFormat 规则 indices|brackets|repeat|comma
 * @returns {string} url参数
 * @example xmQueryParams({a: 1, b: 2})
 */
export function xmQueryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
  const prefix = isPrefix ? '?' : ''
  const _result = []
  if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1)
    arrayFormat = 'brackets'
  for (const key in data) {
    const value = data[key]
    if (['', undefined, null].indexOf(value) >= 0) {
      continue
    }
    if (Array.isArray(value)) {
      // e.g. {ids: [1, 2, 3]}
      switch (arrayFormat) {
        case 'indices':
          // 结果: ids[0]=1&ids[1]=2&ids[2]=3
          for (let i = 0; i < value.length; i++) {
            _result.push(`${key}[${i}]=${value[i]}`)
          }
          break
        case 'brackets':
          // 结果: ids[]=1&ids[]=2&ids[]=3
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`)
          })
          break
        case 'repeat':
          // 结果: ids=1&ids=2&ids=3
          value.forEach((_value) => {
            _result.push(`${key}=${_value}`)
          })
          break
        case 'comma':
          // 结果: ids=1,2,3
          let commaStr = ''
          value.forEach((_value) => {
            commaStr += (commaStr ? ',' : '') + _value
          })
          _result.push(`${key}=${commaStr}`)
          break
        default:
          value.forEach((_value) => {
            _result.push(`${key}[]=${_value}`)
          })
      }
    } else {
      _result.push(`${key}=${value}`)
    }
  }
  return _result.length ? prefix + _result.join('&') : ''
}
/**
 * 面包屑递归扁平化处理
 * @param {Array} nodes 菜单数据
 * @param {String|Number} id 主键id
 * @returns {Array|null} [{}...]
 */
export function findMenuItem(nodes, id) {
  for (let node of nodes) {
    if (node.id === id) {
      return [node]
    } else if (node.children) {
      let result = findMenuItem(node.children, id)
      if (result) {
        return [node, ...result]
      }
    }
  }
  return null
}
/**
 * 判断两数组元素有无交集
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns true or false
 */
export function hasIntersection(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error('参数必须是数组')
  }
  return arr1.some((item) => arr2.includes(item))
}
/**
 * 字典格式化
 * @param {Array} dict 字典数据
 * @param {String} code 字典code
 * @returns {String} name
 * @example xmDictFormat(dict,code)
 */
export function xmDictFormat(dict = [], code) {
  return dict.find((item) => item.code === code)?.name ?? ''
}

/**
 * 将图片返回为组件
 * @param {String} src 图片相对路劲文件地址
 */
export function xmDefineImgComponent(src) {
  return defineComponent(
    () => () => h('img', { src: new URL(`../assets/${src}`, import.meta.url).href })
  )
}
