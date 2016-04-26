import expect from 'expect'
import noop from '../noop'

// Thanks for looking through the code. Have you ever seen a sillier unit test? :-)

describe('noop', () => {
  it('should do nothing', () => {
    expect(noop()).toNotExist()
  })
})
