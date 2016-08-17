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
        destroyOnUnmount: true,
        shouldAsyncValidate: defaultShouldAsyncValidate,
        enableReinitialize: false,
        keepDirtyOnReinitialize: false,
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
                getValues: this.getValues,
                register: this.register,
                unregister: this.unregister
              }
            }
          }

          initIfNeeded(nextProps) {
            if (nextProps) {
              const { enableReinitialize } = this.props
              if ((enableReinitialize || !nextProps.initialized) && !deepEqual(this.props.initialValues, nextProps.initialValues)) {
                const keepDirty = nextProps.initialized && this.props.keepDirtyOnReinitialize
                this.props.initialize(nextProps.initialValues, keepDirty)
              }
            } else if (this.props.initialValues) {
              this.props.initialize(this.props.initialValues)
            }
          }

          updateSyncErrorsIfNeeded(nextSyncErrors) {
            const { syncErrors, updateSyncErrors } = this.props
            const noErrors = !syncErrors || !Object.keys(syncErrors).length
            const nextNoErrors = !nextSyncErrors || !Object.keys(nextSyncErrors).length
            if (!(noErrors && nextNoErrors) && !plain.deepEqual(syncErrors, nextSyncErrors)) {
              updateSyncErrors(nextSyncErrors)
            }
          }

          validateIfNeeded(nextProps) {
            const { validate, values } = this.props
            if (validate) {
              if (nextProps) {
                // not initial render
                if (!deepEqual(values, nextProps.values)) {
                  const nextSyncErrors = validate(nextProps.values, nextProps)
                  this.updateSyncErrorsIfNeeded(nextSyncErrors)
                }
              } else {
                // initial render
                const nextSyncErrors = validate(values, this.props)
                this.updateSyncErrorsIfNeeded(nextSyncErrors)
              }
            }
          }

          componentWillMount() {
            this.initIfNeeded()
            this.validateIfNeeded()
          }

          componentWillReceiveProps(nextProps) {
            this.initIfNeeded(nextProps)
            this.validateIfNeeded(nextProps)
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
            return promise.then(this.submitCompleted, err => {
              this.submitCompleted()
              return Promise.reject(err)
            })
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
              syncErrors,
              unregisterField,
              untouch,
              updateSyncErrors,
              valid,
              values,
              ...rest
            } = this.props
            /* eslint-enable no-unused-vars */
            const reduxFormProps = {
              anyTouched,
              asyncValidate: this.asyncValidate,
              asyncValidating,
              destroy,
              dirty,
              dispatch,
              error,
              form,
              handleSubmit: this.submit,
              initialize,
              initialized,
              invalid,
              pristine,
              reset,
              submitting,
              submitFailed,
              submitSucceeded,
              touch,
              untouch,
              valid
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
          touchOnBlur: PropTypes.bool,
          touchOnChange: PropTypes.bool,
          registeredFields: PropTypes.any
        }

        const connector = connect(
          (state, props) => {
            const { form, getFormState, initialValues } = props
            const formState = getIn(getFormState(state) || empty, form) || empty
            const stateInitial = getIn(formState, 'initial')
            const initial = initialValues || stateInitial || empty
            const values = getIn(formState, 'values') || initial
            const pristine = deepEqual(initial, values)
            const asyncErrors = getIn(formState, 'asyncErrors')
            const syncErrors = getIn(formState, 'syncErrors')
            const registeredFields = getIn(formState, 'registeredFields') || []
            const valid = isValid(form, getFormState)(state)
            const anyTouched = !!getIn(formState, 'anyTouched')
            const submitting = !!getIn(formState, 'submitting')
            const submitFailed = !!getIn(formState, 'submitFailed')
            const submitSucceeded = !!getIn(formState, 'submitSucceeded')
            const error = getIn(formState, 'error')
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
              values,
              valid
            }
          },
          (dispatch, initialProps) => {
            const bindForm = actionCreator => actionCreator.bind(null, initialProps.form)

            // Bind the first parameter on `props.form`
            const boundFormACs = mapValues(formActions, bindForm)
            const boundArrayACs = mapValues(arrayActions, bindForm)
            const boundBlur = (field, value) => blur(initialProps.form, field, value, !!initialProps.touchOnBlur)
            const boundChange = (field, value) => change(initialProps.form, field, value, !!initialProps.touchOnChange)
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
