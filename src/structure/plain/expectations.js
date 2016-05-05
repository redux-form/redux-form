import expect from 'expect'

const isObject = value => value && typeof value === 'object'

const expectations = {
  toBeAMap() {
    expect.assert(
      isObject(this.actual),
      'expected %s to be an object',
      this.actual
    )
    return this
  },

  toBeSize(size) {
    expect.assert(
      this.actual && Object.keys(this.actual).length === size,
      'expected %s to contain %s elements',
      this.actual,
      size
    )
    return this
  },

  toEqualMap(expected) {
    return expect(this.actual).toEqual(expected)
  }
}

export default expectations
