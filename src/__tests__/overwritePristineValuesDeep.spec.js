import plain from '../structure/plain'

import createOverwritePristineValuesDeep from '../createOverwritePristineValuesDeep'

describe('overwritePristineValuesDeep', () => {
  const overwritePristineValuesDeep = createOverwritePristineValuesDeep(plain)

  it('should update pristine values with new values', () => {
    const initialValues = {
      name: 'name',
      title: 'title',
      x: 'x',
      relatedContent: {
        0: ['1']
      },
      object: {
        a: 'a',
        b: 'b',
        c: 'c',
        object2: {
          a2: 'a2',
          b2: 'b2'
        }
      }
    }

    const newInitialValues = {
      name: 'name-new',
      title: 'title-new',
      new: 'new',
      relatedContent: {
        0: ['1'],
        new: ['new', 'new2', 'new3']
      },
      object: {
        a: 'a-new',
        b: 'b-new',
        object2: {
          a2: 'a2-new',
          b2: 'b2-new'
        },
        objectNew: {
          a3: 'a3',
          b3: 'b3'
        }
      }
    }

    const values = {
      name: 'name-dirty',
      title: 'title',
      x: 'x',
      relatedContent: {
        0: ['1', 'dirty']
      },
      object: {
        a: 'a-dirty',
        b: 'b',
        c: 'c',
        d: 'd',
        object2: {
          a2: 'a2-dirty',
          b2: 'b2'
        }
      }
    }

    const newValues = overwritePristineValuesDeep(
      values,
      initialValues,
      newInitialValues
    )

    expect(newValues.title).toEqual('title-new')
    expect(newValues.object.b).toEqual('b-new')
    expect(newValues.object.object2.b2).toEqual('b2-new')

    expect(newValues.name).toEqual('name-dirty')
    expect(newValues.object.a).toEqual('a-dirty')
    expect(newValues.object.object2.a2).toEqual('a2-dirty')

    expect(newValues.x).toBeUndefined()
    expect(newValues.object.c).toBeUndefined()
    expect(newValues.object.d).toEqual('d')
    expect(newValues.new).toEqual('new')
    expect(newValues.object.objectNew).toEqual({
      a3: 'a3',
      b3: 'b3'
    })
    expect(newValues.relatedContent).toEqual({
      0: ['1', 'dirty'],
      new: ['new', 'new2', 'new3']
    })

    expect(newValues).toMatchSnapshot()
  })

  it('should NOT remove a tenant variant if', () => {
    const initialValues = {
      relatedContent: {
        0: ['1'],
        1: ['2']
      }
    }

    const newInitialValues = {
      relatedContent: {
        0: ['1', 'dirty']
      }
    }

    const values = {
      relatedContent: {
        0: ['1'],
        1: ['2'],
        2: ['dirty', 'dirty']
      }
    }

    const newValues = overwritePristineValuesDeep(
      values,
      initialValues,
      newInitialValues
    )

    expect(newValues.relatedContent).toEqual({
      0: ['1', 'dirty'],
      2: ['dirty', 'dirty']
    })
  })

  it('should do this', () => {
    const values = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }
    const initialValues = {
      myField: [{ name: 'One' }, { name: 'Two' }]
    }

    const newInitialValues = {
      myField: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]
    }

    const newValues = overwritePristineValuesDeep(
      values,
      initialValues,
      newInitialValues
    )

    expect(newValues).toEqual({
      myField: [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]
    })
  })
  // it('should NOT update dirty values with new values', () => {})

  // it('should update deeply nested pristine values with new values', () => {})

  // it('should add new values', () => {})

  // it('should remove old values if pristine', () => {})
})
