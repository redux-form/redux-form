// @flow
import { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import createConnectedField from './ConnectedField'
import shallowCompare from './util/shallowCompare'
import prefixName from './util/prefixName'
import plain from './structure/plain'
import type {
  ConnectedComponent,
  Structure,
  ReactContext
} from './types.js.flow'
import type { InstanceApi as ConnectedFieldInstanceApi } from './ConnectedField.types.js.flow'
import type { Component as ReactComponent } from 'react'
import type { Props } from './FieldProps.types.js.flow'

const createField = (structure: Structure<*, *>) => {
  const ConnectedField = createConnectedField(structure)

  const { setIn } = structure

  class Field extends Component {
    props: Props
    context: ReactContext

    ref: ConnectedComponent<ConnectedFieldInstanceApi>

    constructor(props: Props, context: ReactContext) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error(
          'Field must be inside a component decorated with reduxForm()'
        )
      }
    }

    shouldComponentUpdate(nextProps: Props) {
      return shallowCompare(this, nextProps)
    }

    componentWillMount() {
      this.context._reduxForm.register(
        this.name,
        'Field',
        () => this.props.validate,
        () => this.props.warn
      )
    }

    componentWillReceiveProps(nextProps: Props) {
      if (
        this.props.name !== nextProps.name ||
        // use deepEqual here because they could be a function or an array of functions
        !plain.deepEqual(this.props.validate, nextProps.validate) ||
        !plain.deepEqual(this.props.warn, nextProps.warn)
      ) {
        // unregister old name
        this.context._reduxForm.unregister(this.name)
        // register new name
        this.context._reduxForm.register(
          prefixName(this.context, nextProps.name),
          'Field',
          () => nextProps.validate,
          () => nextProps.warn
        )
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    saveRef = (ref: ConnectedComponent<ConnectedFieldInstanceApi>) =>
      (this.ref = ref)

    getRenderedComponent(): ReactComponent<*, *, *> {
      invariant(
        this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
          'you must specify a withRef prop to Field'
      )
      return this.ref.getWrappedInstance().getRenderedComponent()
    }

    get name(): string {
      return prefixName(this.context, this.props.name)
    }

    get dirty(): boolean {
      return !this.pristine
    }

    get pristine(): boolean {
      return this.ref.getWrappedInstance().isPristine()
    }

    get value(): any {
      return this.ref && this.ref.getWrappedInstance().getValue()
    }

    normalize = (name: string, value: any): any => {
      const { normalize } = this.props
      if (!normalize) {
        return value
      }
      const previousValues = this.context._reduxForm.getValues()
      const previousValue = this.value
      const nextValues = setIn(previousValues, name, value)
      return normalize(value, previousValue, nextValues, previousValues)
    }

    render() {
      return createElement(ConnectedField, {
        ...this.props,
        name: this.name,
        normalize: this.normalize,
        _reduxForm: this.context._reduxForm,
        ref: this.saveRef
      })
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      .isRequired,
    format: PropTypes.func,
    normalize: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onDragStart: PropTypes.func,
    onDrop: PropTypes.func,
    parse: PropTypes.func,
    props: PropTypes.object,
    validate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    warn: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    withRef: PropTypes.bool
  }
  Field.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return Field
}

export default createField
