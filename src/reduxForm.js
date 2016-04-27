import React, { Component, PropTypes } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import every from './util/every'
import * as importedActions from './actions'
import bindActionData from './bindActionData'
import handleSubmit from './handleSubmit'
import silenceEvent from './events/silenceEvent'
import silenceEvents from './events/silenceEvents'
import asyncValidation from './asyncValidation'
import plain from './structure/plain'

const { blur, change, focus, ...formActions } = importedActions

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component'
const propsToUpdateFor = [
  'asyncValidating',
  'dirty',
  'error',
  'invalid',
  'pristine',
  'submitting',
  'submitFailed',
  'syncErrors',
  'valid'
]

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  structure => {
    const { deepEqual, empty, getIn, setIn, fromJS } = structure
    return initialConfig => {
      const config = {
        touchOnBlur: true,
        touchOnChange: false,
        destroyOnUnmount: true,
        getFormState: state => getIn(state, 'form'),
        ...initialConfig
      }
      return WrappedComponent => {
        class Form extends Component {
          constructor(props) {
            super(props)
            this.submit = this.submit.bind(this)
            this.asyncValidate = this.asyncValidate.bind(this)
            this.register = this.register.bind(this)
            this.unregister = this.unregister.bind(this)
            this.fields = {}
          }

          getChildContext() {
            return {
              _reduxForm: {
                ...this.props,
                getFormState: state => getIn(this.props.getFormState(state), this.props.form),
                asyncValidate: this.asyncValidate,
                register: this.register,
                unregister: this.unregister
              }
            }
          }

          initIfNeeded({ initialize, initialized, initialValues }) {
            if (initialValues && !initialized) {
              initialize(initialValues)
            }
          }

          componentWillMount() {
            this.initIfNeeded(this.props)
          }

          componentWillReceiveProps(nextProps) {
            this.initIfNeeded(nextProps)
          }

          shouldComponentUpdate(nextProps) {
            // useful to debug rerenders
            //propsToUpdateFor.forEach(prop => {
            //  if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
            //    console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
            //  }
            //})
            return propsToUpdateFor.some(prop => !plain.deepEqual(this.props[ prop ], nextProps[ prop ]))
          }

          get values() {
            return this.props.values
          }

          get valid() {
            return every(this.fields, field => field.valid)
          }

          get invalid() {
            return !this.valid
          }

          register(key, field) {
            this.fields[ key ] = field
          }

          unregister(key) {
            delete this.fields[ key ]
          }

          get fieldList() {
            return Object.values(this.fields).map(field => field.name)
          }

          asyncValidate(name, value) {
            const { asyncBlurFields, asyncValidate, dispatch, initialized, pristine, startAsyncValidation, stopAsyncValidation, syncErrors, values } = this.props
            const isSubmitting = !name
            if (asyncValidate) {
              const valuesToValidate = isSubmitting ? values : setIn(values, name, value)
              const syncValidationPasses = isSubmitting || !getIn(syncErrors, name)
              const isBlurField = !isSubmitting &&
                (!asyncBlurFields || ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]')))

              // if blur validating, only run async validate if sync validation passes and either no
              // blur fields are passed or the field that has blurred is listed
              // if submitting (not blur validation) or form is dirty or form was never initialized
              if (syncValidationPasses && (isSubmitting || !pristine || !initialized) && (isSubmitting || isBlurField)) {
                return asyncValidation(
                  () => asyncValidate(valuesToValidate, dispatch, this.props),
                  startAsyncValidation,
                  stopAsyncValidation,
                  name
                )
              }
            }
          }

          submit(submitOrEvent) {
            const { onSubmit } = this.props

            const check = submit => {
              if (!submit || typeof submit !== 'function') {
                throw new Error(`You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop`)
              }
              return submit
            }
            return !submitOrEvent || silenceEvent(submitOrEvent) ?
              // submitOrEvent is an event: fire submit
              handleSubmit(check(onSubmit), this.props, this.valid, this.asyncValidate, this.fieldList) :
              // submitOrEvent is the submit function: return deferred submit thunk
              silenceEvents(() => handleSubmit(check(submitOrEvent), this.props, this.valid, this.asyncValidate, this.fieldList))
          }

          render() {
            // remove some redux-form config-only props
            const { asyncErrors, reduxMountPoint, destroyOnUnmount, form, getFormState, touchOnBlur,
              touchOnChange, syncErrors, values,
              ...passableProps } = this.props // eslint-disable-line no-redeclare
            return (
              <WrappedComponent
                {...passableProps}
                {...{
                  handleSubmit: this.submit
                }}/>
            )
          }
        }
        Form.displayName = `Form(${getDisplayName(WrappedComponent)})`
        Form.WrappedComponent = WrappedComponent
        Form.childContextTypes = {
          _reduxForm: PropTypes.object.isRequired
        }
        Form.propTypes = {
          destroyOnUnmount: PropTypes.bool,
          form: PropTypes.string.isRequired,
          initialValues: PropTypes.object,
          getFormState: PropTypes.func,
          validate: PropTypes.func,
          touchOnBlur: PropTypes.bool,
          touchOnChange: PropTypes.bool
        }

        const connector = connect(
          (state, props) => {
            const { form, getFormState, initialValues, validate } = props
            const formState = getIn(getFormState(state) || empty, form) || empty
            const stateInitial = getIn(formState, 'initial')
            const initial = initialValues || stateInitial || empty
            const values = getIn(formState, 'values') || initial || empty
            const pristine = deepEqual(initial, values)
            const asyncErrors = getIn(formState, 'asyncErrors')
            const syncErrors = validate && validate(values, props) || {}
            const hasSyncErrors = syncErrors && !plain.deepEqual(syncErrors, {})
            const hasAsyncErrors = asyncErrors && !deepEqual(asyncErrors, empty)
            const valid = !(hasSyncErrors || hasAsyncErrors)
            const anyTouched = !!getIn(formState, 'anyTouched')
            const submitting = !!getIn(formState, 'submitting')
            const submitFailed = !!getIn(formState, 'submitFailed')
            const error = getIn(formState, 'error')
            return {
              anyTouched,
              asyncErrors,
              asyncValidating: getIn(formState, 'asyncValidating'),
              dirty: !pristine,
              error,
              initialized: !!stateInitial,
              invalid: !valid,
              pristine,
              submitting,
              submitFailed,
              syncErrors,
              values,
              valid
            }
          },
          (dispatch, ownProps) => ({
            ...bindActionCreators(bindActionData(formActions, { form: ownProps.form }), dispatch),
            ...bindActionData({
              blur: bindActionData(blur, {
                touch: !!ownProps.touchOnBlur
              }),
              change: bindActionData(change, {
                touch: !!ownProps.touchOnChange
              }),
              focus
            }, { form: ownProps.form }),
            dispatch
          }),
          undefined,
          { withRef: true }
        )
        const ConnectedForm = hoistStatics(connector(Form), WrappedComponent)
        ConnectedForm.defaultProps = config

        // build outer component to expose instance api
        return class ReduxForm extends Component {
          submit() {
            return this.refs.wrapped.getWrappedInstance().submit()
          }

          render() {
            const { initialValues, ...rest } = this.props
            // convert initialValues if need to
            return <ConnectedForm ref="wrapped" initialValues={fromJS(initialValues)} {...rest}/>
          }
        }
      }
    }
  }

export default createReduxForm
