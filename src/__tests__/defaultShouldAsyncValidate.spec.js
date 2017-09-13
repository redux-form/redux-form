import defaultShouldAsyncValidate from '../defaultShouldAsyncValidate'

describe('defaultShouldAsyncValidate', () => {
  it('should not async validate if sync validation is not passing', () => {
    expect(
      defaultShouldAsyncValidate({
        syncValidationPasses: false
      })
    ).toBe(false)
  })

  it('should async validate if blur triggered and sync passes', () => {
    expect(
      defaultShouldAsyncValidate({
        syncValidationPasses: true,
        trigger: 'blur'
      })
    ).toBe(true)
  })

  it('should not async validate when pristine and initialized', () => {
    expect(
      defaultShouldAsyncValidate({
        syncValidationPasses: true,
        trigger: 'submit',
        pristine: true,
        initialized: true
      })
    ).toBe(false)
  })

  it('should async validate when submitting and dirty', () => {
    expect(
      defaultShouldAsyncValidate({
        syncValidationPasses: true,
        trigger: 'submit',
        pristine: false,
        initialized: true
      })
    ).toBe(true)
  })

  it('should async validate when submitting and not initialized', () => {
    expect(
      defaultShouldAsyncValidate({
        syncValidationPasses: true,
        trigger: 'submit',
        pristine: true,
        initialized: false
      })
    ).toBe(true)
  })

  it('should not async validate when unknown trigger', () => {
    expect(
      defaultShouldAsyncValidate({
        syncValidationPasses: true,
        trigger: 'wtf'
      })
    ).toBe(false)
  })
})
