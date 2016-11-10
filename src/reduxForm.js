import { Component, PropTypes, createElement } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { mapValues } from 'lodash'
import isPromise from 'is-promise'
import getDisplayName from './util/getDisplayName'
import * as importedActions from './actions'
import handleSubmit from './handleSubmit'
import silenceEvent from './events/silenceEvent'
import silenceEvents from './events/silenceEvents'
import asyncValidation from './asyncValidation'
import defaultShouldAsyncValidate from './defaultShouldAsyncValidate'
import defaultShouldValidate from './defaultShouldValidate'
import plain from './structure/plain'
import createIsValid from './selectors/isValid'

const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)

// extract field-specific actions
const {
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
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
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
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
  'syncWarnings',
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
    const { deepEqual, empty, getIn, setIn, fromJS } = structure
    const isValid = createIsValid(structure)
    return initialConfig => {
      const config = {
        touchOnBlur: true,
        touchOnChange: false,
        persistentSubmitErrors: false,
        destroyOnUnmount: true,
        shouldAsyncValidate: defaultShouldAsyncValidate,
        shouldValidate: defaultShouldValidate,
        enableReinitialize: false,
        keepDirtyOnReinitialize: false,
        getFormState: state => getIn(state, 'form'),
        pure: true,
        ...initialConfig
      }

      return WrappedComponent => {
        let instances = 0

        class Form extends Component {
          constructor(props) {
            super(props)
            this.submit = this.submit.bind(this)
            this.reset = this.reset.bind(this)
            this.asyncValidate = this.asyncValidate.bind(this)
            this.getValues = this.getValues.bind(this)
            this.register = this.register.bind(this)
            this.unregister = this.unregister.bind(this)
            this.submitCompleted = this.submitCompleted.bind(this)

            instances++
          }

          getChildContext() {
            return {
              _reduxForm: {
                ...this.props,
                getFormState: state => getIn(this.props.getFormState(state), this.props.form),
                asyncValidate: this.asyncValidate,
                getValues: this.getValues,
                sectionPrefix: undefined,
                register: this.register,
                unregister: this.unregister
              }
            }
          }

          initIfNeeded(nextProps) {
            const { enableReinitialize } = this.props
            if (nextProps) {
              if ((enableReinitialize || !nextProps.initialized) && !deepEqual(this.props.initialValues, nextProps.initialValues)) {
                const keepDirty = nextProps.initialized && this.props.keepDirtyOnReinitialize
                this.props.initialize(nextProps.initialValues, keepDirty)
              }
            } else if (this.props.initialValues && (!this.props.initialized || enableReinitialize)) {
              this.props.initialize(this.props.initialValues, this.props.keepDirtyOnReinitialize)
            }
          }

          updateSyncErrorsIfNeeded(nextSyncErrors, nextError) {
            const { error, syncErrors, updateSyncErrors } = this.props
            const noErrors = (!syncErrors || !Object.keys(syncErrors).length) && !error
            const nextNoErrors = (!nextSyncErrors || !Object.keys(nextSyncErrors).length) && !nextError
            if (!(noErrors && nextNoErrors) && (!plain.deepEqual(syncErrors, nextSyncErrors) || !plain.deepEqual(error, nextError))) {
              updateSyncErrors(nextSyncErrors, nextError)
            }
          }

          submitIfNeeded(nextProps) {
            const { clearSubmit, triggerSubmit } = this.props
            if(!triggerSubmit && nextProps.triggerSubmit) {
              clearSubmit()
              this.submit()
            }
          }

          validateIfNeeded(nextProps) {
            const { shouldValidate, validate, values } = this.props
            if (validate) {
              const initialRender = nextProps === undefined
              const shouldValidateResult = shouldValidate({
                values,
                nextProps,
                props: this.props,
                initialRender,
                structure
              })

              if (shouldValidateResult) {
                if (initialRender) {
                  const { _error, ...nextSyncErrors } = validate(values, this.props)
                  this.updateSyncErrorsIfNeeded(nextSyncErrors, _error)
                } else {
                  const { _error, ...nextSyncErrors } = validate(nextProps.values, nextProps)
                  this.updateSyncErrorsIfNeeded(nextSyncErrors, _error)
                }
              }
            }
          }

          updateSyncWarningsIfNeeded(nextSyncWarnings, nextWarning) {
            const { warning, syncWarnings, updateSyncWarnings } = this.props
            const noWarnings = (!syncWarnings || !Object.keys(syncWarnings).length) && !warning
            const nextNoWarnings = (!nextSyncWarnings || !Object.keys(nextSyncWarnings).length) && !nextWarning
            if (!(noWarnings && nextNoWarnings) && (!plain.deepEqual(syncWarnings, nextSyncWarnings) || !plain.deepEqual(warning, nextWarning))) {
              updateSyncWarnings(nextSyncWarnings, nextWarning)
            }
          }

          warnIfNeeded(nextProps) {
            const { warn, values } = this.props
            if (warn) {
              if (nextProps) {
                // not initial render
                if (!deepEqual(values, nextProps.values)) {
                  const { _warning, ...nextSyncWarnings } = warn(nextProps.values, nextProps)
                  this.updateSyncWarningsIfNeeded(nextSyncWarnings, _warning)
                }
              } else {
                // initial render
                const { _warning, ...nextSyncWarnings } = warn(values, this.props)
                this.updateSyncWarningsIfNeeded(nextSyncWarnings, _warning)
              }
            }
          }

          componentWillMount() {
            this.initIfNeeded()
            this.validateIfNeeded()
            this.warnIfNeeded()
          }

          componentWillReceiveProps(nextProps) {
            this.initIfNeeded(nextProps)
            this.validateIfNeeded(nextProps)
            this.warnIfNeeded(nextProps)
            this.submitIfNeeded(nextProps)
          }

          shouldComponentUpdate(nextProps) {
            if (!config.pure) return true
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

            this.unmounted = true

            instances--
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
            if (this.props.destroyOnUnmount && !this.destroyed && (!this.unmounted || !instances)) {
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
                  () => asyncValidate(valuesToValidate, dispatch, this.props, name),
                  startAsyncValidation,
                  stopAsyncValidation,
                  name
                )
              }
            }
          }

          submitCompleted(result) {
            delete this.submitPromise
            return result
          }

          listenToSubmit(promise) {
            if (!isPromise(promise)) {
              return promise
            }
            this.submitPromise = promise
            return promise.then(this.submitCompleted)
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
              anyTouched,
              arrayInsert,
              arrayMove,
              arrayPop,
              arrayPush,
              arrayRemove,
              arrayRemoveAll,
              arrayShift,
              arraySplice,
              arraySwap,
              arrayUnshift,
              asyncErrors,
              asyncValidate,
              asyncValidating,
              blur,
              change,
              destroy,
              destroyOnUnmount,
              dirty,
              dispatch,
              enableReinitialize,
              error,
              focus,
              form,
              getFormState,
              initialize,
              initialized,
              initialValues,
              invalid,
              keepDirtyOnReinitialize,
              pristine,
              propNamespace,
              registeredFields,
              registerField,
              reset,
              setSubmitFailed,
              setSubmitSucceeded,
              shouldAsyncValidate,
              shouldValidate,
              startAsyncValidation,
              startSubmit,
              stopAsyncValidation,
              stopSubmit,
              submitting,
              submitFailed,
              submitSucceeded,
              touch,
              touchOnBlur,
              touchOnChange,
              persistentSubmitErrors,
              syncErrors,
              syncWarnings,
              unregisterField,
              untouch,
              updateSyncErrors,
              updateSyncWarnings,
              valid,
              values,
              warning,
              ...rest
            } = this.props
            /* eslint-enable no-unused-vars */
            const reduxFormProps = {
              anyTouched,
              asyncValidate: this.asyncValidate,
              asyncValidating,
              ...bindActionCreators({ blur, change }, dispatch),
              destroy,
              dirty,
              dispatch,
              error,
              form,
              handleSubmit: this.submit,
              initialize,
              initialized,
              initialValues,
              invalid,
              pristine,
              reset,
              submitting,
              submitFailed,
              submitSucceeded,
              touch,
              untouch,
              valid,
              warning
            }
            const propsToPass = {
              ...(propNamespace ? { [propNamespace]: reduxFormProps } : reduxFormProps),
              ...rest
            }
            if (isClassComponent(WrappedComponent)) {
              propsToPass.ref = 'wrapped'
            }
            return createElement(WrappedComponent, propsToPass)
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
          onSubmitFail: PropTypes.func,
          onSubmitSuccess: PropTypes.func,
          propNameSpace: PropTypes.string,
          validate: PropTypes.func,
          warn: PropTypes.func,
          touchOnBlur: PropTypes.bool,
          touchOnChange: PropTypes.bool,
          triggerSubmit: PropTypes.bool,
          persistentSubmitErrors: PropTypes.bool,
          registeredFields: PropTypes.any
        }

        const connector = connect(
          (state, props) => {
            const { form, getFormState, initialValues, enableReinitialize, keepDirtyOnReinitialize } = props
            const formState = getIn(getFormState(state) || empty, form) || empty
            const stateInitial = getIn(formState, 'initial')

            const shouldUpdateInitialValues = enableReinitialize && !deepEqual(initialValues, stateInitial)
            const shouldResetValues = shouldUpdateInitialValues && !keepDirtyOnReinitialize

            let initial = initialValues || stateInitial || empty

            if (shouldUpdateInitialValues) {
              initial = stateInitial
            }

            let values = getIn(formState, 'values') || initial

            if (shouldResetValues) {
              values = initial
            }

            const pristine = deepEqual(initial, values)
            const asyncErrors = getIn(formState, 'asyncErrors')
            const syncErrors = getIn(formState, 'syncErrors') || {}
            const syncWarnings = getIn(formState, 'syncWarnings') || {}
            const registeredFields = getIn(formState, 'registeredFields') || []
            const valid = isValid(form, getFormState)(state)
            const anyTouched = !!getIn(formState, 'anyTouched')
            const submitting = !!getIn(formState, 'submitting')
            const submitFailed = !!getIn(formState, 'submitFailed')
            const submitSucceeded = !!getIn(formState, 'submitSucceeded')
            const error = getIn(formState, 'error')
            const warning = getIn(formState, 'warning')
            const triggerSubmit = getIn(formState, 'triggerSubmit')
            return {
              anyTouched,
              asyncErrors,
              asyncValidating: getIn(formState, 'asyncValidating') || false,
              dirty: !pristine,
              error,
              initialized: !!stateInitial,
              invalid: !valid,
              pristine,
              registeredFields,
              submitting,
              submitFailed,
              submitSucceeded,
              syncErrors,
              syncWarnings,
              triggerSubmit,
              values,
              valid,
              warning
            }
          },
          (dispatch, initialProps) => {
            const bindForm = actionCreator => actionCreator.bind(null, initialProps.form)

            // Bind the first parameter on `props.form`
            const boundFormACs = mapValues(formActions, bindForm)
            const boundArrayACs = mapValues(arrayActions, bindForm)
            const boundBlur = (field, value) => blur(initialProps.form, field, value, !!initialProps.touchOnBlur)
            const boundChange = (field, value) => change(initialProps.form, field, value, !!initialProps.touchOnChange, !!initialProps.persistentSubmitErrors)
            const boundFocus = bindForm(focus)

            // Wrap action creators with `dispatch`
            const connectedFormACs = bindActionCreators(boundFormACs, dispatch)
            const connectedArrayACs = {
              insert: bindActionCreators(boundArrayACs.arrayInsert, dispatch),
              move: bindActionCreators(boundArrayACs.arrayMove, dispatch),
              pop: bindActionCreators(boundArrayACs.arrayPop, dispatch),
              push: bindActionCreators(boundArrayACs.arrayPush, dispatch),
              remove: bindActionCreators(boundArrayACs.arrayRemove, dispatch),
              removeAll: bindActionCreators(boundArrayACs.arrayRemoveAll, dispatch),
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

          get wrappedInstance() { // for testine
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
