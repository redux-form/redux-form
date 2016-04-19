import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import bindActionData from './bindActionData'

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component'

const formConnect = (mapStateToProps, mapDispatchToProps) =>
  WrappedComponent => {
    const FormContextListner = (props, context) => {
      if (!context._reduxForm) {
        throw new Error(`${getDisplayName(WrappedComponent)} must be inside a component decorated with reduxForm()`)
      }
      const { form, getFormState } = context._reduxForm
      const ConnectedComponent = connect(
        state => mapStateToProps(getFormState(state)),
        bindActionData(mapDispatchToProps, { form })
      )(WrappedComponent)
      return <ConnectedComponent {...props}/>
    }
    FormContextListner.contextTypes = {
      _reduxForm: PropTypes.object
    }
    return FormContextListner
  }

export default formConnect
