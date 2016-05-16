import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedFieldArray from './ConnectedFieldArray'
import shallowCompare from 'react-addons-shallow-compare'

let keys = 0
const generateKey = () => `redux-form-field-array-${keys++}`

const createFieldArray = ({ deepEqual, getIn, size }) => {

  class FieldArray extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('FieldArray must be inside a component decorated with reduxForm()')
      }
      this.key = generateKey()
      this.ConnectedFieldArray = createConnectedFieldArray(context._reduxForm, { deepEqual, getIn, size }, props.name)
    }

    shouldComponentUpdate(nextProps) {
      const propsWithoutComponent = { ...this.props }
      const nextPropsWithoutComponent = { ...nextProps }
      delete propsWithoutComponent.component
      delete nextPropsWithoutComponent.component
      return shallowCompare({ props: propsWithoutComponent }, nextPropsWithoutComponent)
    }

    componentWillMount() {
      this.context._reduxForm.register(this.key, this)
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedFieldArray =
          createConnectedFieldArray(this.context._reduxForm, { deepEqual, getIn, size }, nextProps.name)
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.key)
    }

    get valid() {
      return this.refs.connected.getWrappedInstance().valid
    }

    get name() {
      return this.props.name
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to FieldArray')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    render() {
      return createElement(this.ConnectedFieldArray, {
        ...this.props,
        ref: 'connected'
      })
    }
  }

  FieldArray.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired
  }
  FieldArray.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return FieldArray
}

export default createFieldArray
