import { Component, PropTypes, createElement } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { mapValues, partial, partialRight } from 'lodash'
import isPromise from 'is-promise'
import getDisplayName from './util/getDisplayName'
import * as importedActions from './actions'
import handleSubmit from './handleSubmit'
import silenceEvent from './events/silenceEvent'
import silenceEvents from './events/silenceEvents'
import asyncValidation from './asyncValidation'
import createHasErrors from './hasErrors'
import createHasError from './hasError'
import defaultShouldAsyncValidate from './defaultShouldAsyncValidate'
import plain from './structure/plain'

const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)

// extract field-specific actions
const {
  arrayInsert,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  blur,
  change,
  focus,
  ...formActions
} = importedActions

const arrayActions = {
  arrayInsert,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift
}

const propsToNotUpdateFor = [
  ...Object.keys(importedActions),
  'array',
  'asyncErrors',
  'initialized',
  'initialValues',
  'syncErrors',
  'values',
  'registeredFields'
]

const checkSubmit = submit => {
  if (!submit || typeof submit !== 'function') {
    throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop')
  }
  return submit
}

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  structure => {
    const { deepEqual, empty, getIn, setIn, fromJS, some } = structure
    const hasErrors = createHasErrors(structure)
    const hasError = createHasError(structure)
    const plainHasErrors = createHasErrors(plain)
    return initialConfig => {
      const config = {
        touchOnBlur: true,
        touchOnChange: false,
        destroyOnUnmount: true,
        shouldAsyncValidate: defaultShouldAsyncValidate,
        getFormState: state => getIn(state, 'form'),
        ...initialConfig
      }
      return WrappedComponent => {
        class Form extends Component {
          constructor(props) {
            super(props)
            this.submit = this.submit.bind(this)
            this.reset = this.reset.bind(this)
            this.asyncValidate = this.asyncValidate.bind(this)
            this.getSyncErrors = this.getSyncErrors.bind(this)
            this.getValues = this.getValues.bind(this)
            this.register = this.register.bind(this)
            this.unregister = this.unregister.bind(this)
            this.submitCompleted = this.submitCompleted.bind(this)
          }

          getChildContext() {
            return {
              _reduxForm: {
                ...this.props,
                getFormState: state => getIn(this.props.getFormState(state), this.props.form),
                asyncValidate: this.asyncValidate,
                getSyncErrors: this.getSyncErrors,
                getValues: this.getValues,
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
            return Object.keys(nextProps).some(prop => {
              // useful to debug rerenders
              // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
              //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
              // }
              return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(this.props[ prop ], nextProps[ prop ])
            })
          }

          componentWillUnmount() {
            const { destroyOnUnmount, destroy } = this.props
            if (destroyOnUnmount) {
              this.destroyed = true
              destroy()
            }
          }

          getSyncErrors() {
            return this.props.syncErrors
          }

          getValues() {
            return this.props.values
          }

          isValid() {
            return this.props.valid
          }

          isPristine() {
            return this.props.pristine
          }

          register(name, type) {
            this.props.registerField(name, type)
          }

          unregister(name) {
            if (!this.destroyed) {
              this.props.unregisterField(name)
            }
          }

          getFieldList() {
            return this.props.registeredFields.map((field) => getIn(field, 'name'))
          }

          asyncValidate(name, value) {
            const {
              asyncBlurFields,
              asyncErrors,
              asyncValidate,
              dispatch,
              initialized,
              pristine,
              shouldAsyncValidate,
              startAsyncValidation,
              stopAsyncValidation,
              syncErrors,
              values
            } = this.props
            const submitting = !name
            if (asyncValidate) {
              const valuesToValidate = submitting ? values : setIn(values, name, value)
              const syncValidationPasses = submitting || !getIn(syncErrors, name)
              const isBlurredField = !submitting &&
                (!asyncBlurFields || ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]')))
              if ((isBlurredField || submitting) && shouldAsyncValidate({
                asyncErrors,
                initialized,
                trigger: submitting ? 'submit' : 'blur',
                blurredField: name,
                pristine,
                syncValidationPasses
              })) {
                return asyncValidation(
                  () => asyncValidate(valuesToValidate, dispatch, this.props),
                  startAsyncValidation,
                  stopAsyncValidation,
                  name
                )
              }
            }
          }

          submitCompleted(result) {
            delete this.submitPromise
            return resultgetIn(formState, 'registeredFields')
          }

          listenToSubmit(promise) {
            if (!isPromise(promise)) {
              return promise
            }
            this.submitPromise = promise
            return promise.then(this.submitCompleted, this.submitCompleted)
          }

          submit(submitOrEvent) {
            const { onSubmit } = this.props

            if (!submitOrEvent || silenceEvent(submitOrEvent)) {
              // submitOrEvent is an event: fire submit if not already submitting
              if (!this.submitPromise) {
                return this.listenToSubmit(handleSubmit(checkSubmit(onSubmit),
                  this.props, this.isValid(), this.asyncValidate, this.getFieldList()))
              }
            } else {
              // submitOrEvent is the submit function: return deferred submit thunk
              return silenceEvents(() =>
              !this.submitPromise &&
              this.listenToSubmit(handleSubmit(checkSubmit(submitOrEvent),
                this.props, this.isValid(), this.asyncValidate, this.getFieldList())))
            }
          }

          reset() {
            this.props.reset()
          }

          render() {
            // remove some redux-form config-only props
            /* eslint-disable no-unused-vars */
            const {
              arrayInsert,
              arrayPop,
              arrayPush,
              arrayRemove,
              arrayShift,
              arraySplice,
              arraySwap,
              arrayUnshift,
              asyncErrors,
              reduxMountPoint,
              destroyOnUnmount,
              getFormState,
              touchOnBlur,
              touchOnChange,
              syncErrors,
              values,
              registerField,
              unregisterField,
              ...passableProps
            } = this.props
            /* eslint-enable no-unused-vars */
            if (isClassComponent(WrappedComponent)) {
              passableProps.ref = 'wrapped'
            }
            return createElement(WrappedComponent, {
              ...passableProps,
              handleSubmit: this.submit
            })
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
          touchOnChange: PropTypes.bool,
          registeredFields: PropTypes.any
        }

        const connector = connect(
          (state, props) => {
            const { form, getFormState, initialValues, validate } = props
            const formState = getIn(getFormState(state) || empty, form) || empty
            const stateInitial = getIn(formState, 'initial')
            const initial = initialValues || stateInitial || empty
            const values = getIn(formState, 'values') || initial
            const pristine = deepEqual(initial, values)
            const asyncErrors = getIn(formState, 'asyncErrors')
            const submitErrors = getIn(formState, 'submitErrors')
            const syncErrors = validate && validate(values, props) || {}
            const hasSyncErrors = plainHasErrors(syncErrors)
            const hasAsyncErrors = hasErrors(asyncErrors)
            const hasSubmitErrors = hasErrors(submitErrors)
            const registeredFields = getIn(formState, 'registeredFields')
            const hasFieldWithError = registeredFields && some(registeredFields, ((field) => {
              return hasError(field, syncErrors, asyncErrors, submitErrors)
            }))
            const valid =
              !hasSyncErrors && !hasAsyncErrors && !hasSubmitErrors && !hasFieldWithError
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
              registeredFields,
              submitting,
              submitFailed,
              syncErrors,
              values,
              valid
            }
          },
          (dispatch, initialProps) => {
            const bindForm = actionCreator => partial(actionCreator, initialProps.form)

            // Bind the first parameter on `props.form`
            const boundFormACs = mapValues(formActions, bindForm)
            const boundArrayACs = mapValues(arrayActions, bindForm)
            const boundBlur = partialRight(bindForm(blur), !!initialProps.touchOnBlur)
            const boundChange = partialRight(bindForm(change), !!initialProps.touchOnChange)
            const boundFocus = bindForm(focus)

            // Wrap action creators with `dispatch`
            const connectedFormACs = bindActionCreators(boundFormACs, dispatch)
            const connectedArrayACs = {
              insert: bindActionCreators(boundArrayACs.arrayInsert, dispatch),
              pop: bindActionCreators(boundArrayACs.arrayPop, dispatch),
              push: bindActionCreators(boundArrayACs.arrayPush, dispatch),
              remove: bindActionCreators(boundArrayACs.arrayRemove, dispatch),
              shift: bindActionCreators(boundArrayACs.arrayShift, dispatch),
              splice: bindActionCreators(boundArrayACs.arraySplice, dispatch),
              swap: bindActionCreators(boundArrayACs.arraySwap, dispatch),
              unshift: bindActionCreators(boundArrayACs.arrayUnshift, dispatch)
            }

            const computedActions = {
              ...connectedFormACs,
              ...boundArrayACs,
              blur: boundBlur,
              change: boundChange,
              array: connectedArrayACs,
              focus: boundFocus,
              dispatch
            }

            return () => computedActions
          },
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

          reset() {
            return this.refs.wrapped.getWrappedInstance().reset()
          }

          get valid() {
            return this.refs.wrapped.getWrappedInstance().isValid()
          }

          get invalid() {
            return !this.valid
          }

          get pristine() {
            return this.refs.wrapped.getWrappedInstance().isPristine()
          }

          get dirty() {
            return !this.pristine
          }

          get values() {
            return this.refs.wrapped.getWrappedInstance().getValues()
          }

          get fieldList() { // mainly provided for testing
            return this.refs.wrapped.getWrappedInstance().getFieldList()
          }

          get wrappedInstance() { // for testing
            return this.refs.wrapped.getWrappedInstance().refs.wrapped
          }

          render() {
            const { initialValues, ...rest } = this.props
            return createElement(ConnectedForm, {
              ...rest,
              ref: 'wrapped',
              // convert initialValues if need to
              initialValues: fromJS(initialValues)
            })
          }
        }
      }
    }
  }

export default createReduxForm
