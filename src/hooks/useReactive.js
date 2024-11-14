const defClone = (value) => {
  if (value == null || typeof value !== 'object') return value
  return JSON.parse(JSON.stringify(value))
}

export const useXmReactive = (initData, clone = defClone) => {
  const data = reactive(clone(initData))

  const reset = (value) => {
    Object.keys(data).forEach((key) => delete data[key])
    Object.assign(data, clone(value))
  }

  return [data, reset]
}
