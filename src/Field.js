import { Component, PropTypes, createElement } from 'react'
import invariant from 'invariant'
import createConnectedField from './ConnectedField'
import shallowCompare from 'react-addons-shallow-compare'

const createField = ({ deepEqual, getIn }) => {

  class Field extends Component {
    constructor(props, context) {
      super(props, context)
      if (!context._reduxForm) {
        throw new Error('Field must be inside a component decorated with reduxForm()')
      }
      this.ConnectedField = createConnectedField(context._reduxForm, { deepEqual, getIn }, props.name)
    }

    shouldComponentUpdate(nextProps) {
      const propsWithoutComponent = { ...this.props }
      const nextPropsWithoutComponent = { ...nextProps }
      delete propsWithoutComponent.component
      delete nextPropsWithoutComponent.component
      return shallowCompare({ props: propsWithoutComponent }, nextPropsWithoutComponent)
    }

    componentWillMount() {
      this.context._reduxForm.register(this.name, 'Field')
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.name !== nextProps.name) {
        // name changed, regenerate connected field
        this.ConnectedField =
          createConnectedField(this.context._reduxForm, { deepEqual, getIn }, nextProps.name)
      }
    }

    componentWillUnmount() {
      this.context._reduxForm.unregister(this.name)
    }

    getRenderedComponent() {
      invariant(this.props.withRef,
        'If you want to access getRenderedComponent(), ' +
        'you must specify a withRef prop to Field')
      return this.refs.connected.getWrappedInstance().getRenderedComponent()
    }

    get name() {
      return this.props.name
    }

    get dirty() {
      return this.refs.connected.getWrappedInstance().dirty
    }

    get pristine() {
      return this.refs.connected.getWrappedInstance().pristine
    }

    get value() {
      return this.refs.connected.getWrappedInstance().value
    }

    render() {
      return createElement(this.ConnectedField, {
        ...this.props,
        ref: 'connected'
      })
    }
  }

  Field.propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    defaultValue: PropTypes.any
  }
  Field.contextTypes = {
    _reduxForm: PropTypes.object
  }

  return Field
}

export default createField
