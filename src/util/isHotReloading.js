// @flow
const isHotReloading = (): boolean => {
  const castModule = (globalThis.module: any)
  return !!(
    typeof castModule !== 'undefined' &&
    castModule.hot &&
    typeof castModule.hot.status === 'function' &&
    castModule.hot.status() === 'apply'
  )
}

export default isHotReloading
