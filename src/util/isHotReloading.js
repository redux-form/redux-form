// @flow
const isHotReloading = (): boolean => {
  const castModule = (typeof module !== 'undefined' && module) as any
  return !!(
    castModule &&
    castModule.hot &&
    typeof castModule.hot.status === 'function' &&
    castModule.hot.status() === 'apply'
  )
}

export default isHotReloading
