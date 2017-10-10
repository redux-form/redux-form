// @flow
const isHotReloading = (): boolean =>
  (typeof module !== 'undefined' &&
    module.hot &&
    typeof module.hot.status === 'function' &&
    module.hot.status() === 'apply') ||
  false

export default isHotReloading
