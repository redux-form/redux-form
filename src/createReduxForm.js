import hoistStatics from 'hoist-non-react-statics'
import isPromise from 'is-promise'
import { mapValues, merge } from 'lodash'
import PropTypes from 'prop-types'
import { Component, createElement } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as importedActions from './actions'
import asyncValidation from './asyncValidation'
import defaultShouldAsyncValidate from './defaultShouldAsyncValidate'
import defaultShouldValidate from './defaultShouldValidate'
import silenceEvent from './events/silenceEvent'
import silenceEvents from './events/silenceEvents'
import generateValidator from './generateValidator'
import handleSubmit from './handleSubmit'
import createIsValid from './selectors/isValid'
import plain from './structure/plain'
import getDisplayName from './util/getDisplayName'

const isClassComponent = Component =>
  Boolean(
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
  'initialValues',
  'syncErrors',
  'syncWarnings',
  'values',
  'registeredFields'
]

const checkSubmit = submit => {
  if (!submit || typeof submit !== 'function') {
    throw new Error(
      'You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop'
    )
  }
  return submit
}

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm = structure => {
  const { deepEqual, empty, getIn, setIn, keys, fromJS } = structure
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
      forceUnregisterOnUnmount: false,
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
          this.submitFailed = this.submitFailed.bind(this)
          this.fieldValidators = {}
          this.lastFieldValidatorKeys = []
          this.fieldWarners = {}
          this.lastFieldWarnerKeys = []
        }

        getChildContext() {
          return {
            _reduxForm: {
              ...this.props,
              getFormState: state =>
                getIn(this.props.getFormState(state), this.props.form),
              asyncValidate: this.asyncValidate,
              getValues: this.getValues,
              sectionPrefix: undefined,
              register: this.register,
              unregister: this.unregister,
              registerInnerOnSubmit: innerOnSubmit =>
                (this.innerOnSubmit = innerOnSubmit)
            }
          }
        }

        initIfNeeded(nextProps) {
          const { enableReinitialize } = this.props
          if (nextProps) {
            if (
              (enableReinitialize || !nextProps.initialized) &&
              !deepEqual(this.props.initialValues, nextProps.initialValues)
            ) {
              const keepDirty =
                nextProps.initialized && this.props.keepDirtyOnReinitialize
              this.props.initialize(nextProps.initialValues, keepDirty, {
                lastInitialValues: this.props.initialValues
              })
            }
          } else if (
            this.props.initialValues &&
            (!this.props.initialized || enableReinitialize)
          ) {
            this.props.initialize(
              this.props.initialValues,
              this.props.keepDirtyOnReinitialize
            )
          }
        }

        updateSyncErrorsIfNeeded(nextSyncErrors, nextError, lastSyncErrors) {
          const { error, updateSyncErrors } = this.props
          const noErrors =
            (!lastSyncErrors || !Object.keys(lastSyncErrors).length) && !error
          const nextNoErrors =
            (!nextSyncErrors || !Object.keys(nextSyncErrors).length) &&
            !nextError
          if (
            !(noErrors && nextNoErrors) &&
            (!plain.deepEqual(lastSyncErrors, nextSyncErrors) ||
              !plain.deepEqual(error, nextError))
          ) {
            updateSyncErrors(nextSyncErrors, nextError)
          }
        }

        clearSubmitPromiseIfNeeded(nextProps) {
          const { submitting } = this.props
          if (this.submitPromise && submitting && !nextProps.submitting) {
            delete this.submitPromise
          }
        }

        submitIfNeeded(nextProps) {
          const { clearSubmit, triggerSubmit } = this.props
          if (!triggerSubmit && nextProps.triggerSubmit) {
            clearSubmit()
            this.submit()
          }
        }

        validateIfNeeded(nextProps) {
          const { shouldValidate, validate, values } = this.props
          const fieldLevelValidate = this.generateValidator()
          if (validate || fieldLevelValidate) {
            const initialRender = nextProps === undefined
            const fieldValidatorKeys = Object.keys(this.getValidators())
            const shouldValidateResult = shouldValidate({
              values,
              nextProps,
              props: this.props,
              initialRender,
              lastFieldValidatorKeys: this.lastFieldValidatorKeys,
              fieldValidatorKeys,
              structure
            })

            if (shouldValidateResult) {
              const propsToValidate = initialRender ? this.props : nextProps
              const { _error, ...nextSyncErrors } = merge(
                validate
                  ? validate(propsToValidate.values, propsToValidate) || {}
                  : {},
                fieldLevelValidate
                  ? fieldLevelValidate(
                      propsToValidate.values,
                      propsToValidate
                    ) || {}
                  : {}
              )
              this.lastFieldValidatorKeys = fieldValidatorKeys
              this.updateSyncErrorsIfNeeded(
                nextSyncErrors,
                _error,
                propsToValidate.syncErrors
              )
            }
          }
        }

        updateSyncWarningsIfNeeded(
          nextSyncWarnings,
          nextWarning,
          lastSyncWarnings
        ) {
          const { warning, syncWarnings, updateSyncWarnings } = this.props
          const noWarnings =
            (!syncWarnings || !Object.keys(syncWarnings).length) && !warning
          const nextNoWarnings =
            (!nextSyncWarnings || !Object.keys(nextSyncWarnings).length) &&
            !nextWarning
          if (
            !(noWarnings && nextNoWarnings) &&
            (!plain.deepEqual(lastSyncWarnings, nextSyncWarnings) ||
              !plain.deepEqual(warning, nextWarning))
          ) {
            updateSyncWarnings(nextSyncWarnings, nextWarning)
          }
        }

        warnIfNeeded(nextProps) {
          const { shouldValidate, warn, values } = this.props
          const fieldLevelWarn = this.generateWarner()
          if (warn || fieldLevelWarn) {
            const initialRender = nextProps === undefined
            const fieldWarnerKeys = Object.keys(this.getWarners())
            const shouldWarnResult = shouldValidate({
              values,
              nextProps,
              props: this.props,
              initialRender,
              lastFieldValidatorKeys: this.lastFieldWarnerKeys,
              fieldValidatorKeys: fieldWarnerKeys,
              structure
            })

            if (shouldWarnResult) {
              const propsToWarn = initialRender ? this.props : nextProps
              const { _warning, ...nextSyncWarnings } = merge(
                warn ? warn(propsToWarn.values, propsToWarn) : {},
                fieldLevelWarn
                  ? fieldLevelWarn(propsToWarn.values, propsToWarn)
                  : {}
              )
              this.lastFieldWarnerKeys = fieldWarnerKeys
              this.updateSyncWarningsIfNeeded(
                nextSyncWarnings,
                _warning,
                propsToWarn.syncWarnings
              )
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
          this.clearSubmitPromiseIfNeeded(nextProps)
          this.submitIfNeeded(nextProps)
          if (nextProps.onChange) {
            if (!deepEqual(nextProps.values, this.props.values)) {
              nextProps.onChange(
                nextProps.values,
                nextProps.dispatch,
                nextProps
              )
            }
          }
        }

        shouldComponentUpdate(nextProps) {
          if (!this.props.pure) return true
          return Object.keys(nextProps).some(prop => {
            // useful to debug rerenders
            // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
            //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
            // }
            return (
              !~propsToNotUpdateFor.indexOf(prop) &&
              !deepEqual(this.props[prop], nextProps[prop])
            )
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

        register(name, type, getValidator, getWarner) {
          this.props.registerField(name, type)
          if (getValidator) {
            this.fieldValidators[name] = getValidator
          }
          if (getWarner) {
            this.fieldWarners[name] = getWarner
          }
        }

        unregister(name) {
          if (!this.destroyed) {
            if (
              this.props.destroyOnUnmount ||
              this.props.forceUnregisterOnUnmount
            ) {
              this.props.unregisterField(name)
              delete this.fieldValidators[name]
              delete this.fieldWarners[name]
            } else {
              this.props.unregisterField(name, false)
            }
          }
        }

        getFieldList(options) {
          let registeredFields = this.props.registeredFields
          let list = []
          if (!registeredFields) {
            return list
          }
          let keySeq = keys(registeredFields)
          if (options && options.excludeFieldArray) {
            keySeq = keySeq.filter(
              name =>
                getIn(registeredFields, `['${name}'].type`) !== 'FieldArray'
            )
          }
          return fromJS(
            keySeq.reduce((acc, key) => {
              acc.push(key)
              return acc
            }, list)
          )
        }

        getValidators() {
          const validators = {}
          Object.keys(this.fieldValidators).forEach(name => {
            const validator = this.fieldValidators[name]()
            if (validator) {
              validators[name] = validator
            }
          })
          return validators
        }

        generateValidator() {
          const validators = this.getValidators()
          return Object.keys(validators).length
            ? generateValidator(validators, structure)
            : undefined
        }

        getWarners() {
          const warners = {}
          Object.keys(this.fieldWarners).forEach(name => {
            const warner = this.fieldWarners[name]()
            if (warner) {
              warners[name] = warner
            }
          })
          return warners
        }

        generateWarner() {
          const warners = this.getWarners()
          return Object.keys(warners).length
            ? generateValidator(warners, structure)
            : undefined
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
            const valuesToValidate = submitting
              ? values
              : setIn(values, name, value)
            const syncValidationPasses = submitting || !getIn(syncErrors, name)
            const isBlurredField =
              !submitting &&
              (!asyncBlurFields ||
                ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]')))
            if (
              (isBlurredField || submitting) &&
              shouldAsyncValidate({
                asyncErrors,
                initialized,
                trigger: submitting ? 'submit' : 'blur',
                blurredField: name,
                pristine,
                syncValidationPasses
              })
            ) {
              return asyncValidation(
                () =>
                  asyncValidate(valuesToValidate, dispatch, this.props, name),
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

        submitFailed(error) {
          delete this.submitPromise
          throw error
        }

        listenToSubmit(promise) {
          if (!isPromise(promise)) {
            return promise
          }
          this.submitPromise = promise
          return promise.then(this.submitCompleted, this.submitFailed)
        }

        submit(submitOrEvent) {
          const { onSubmit, blur, change, dispatch } = this.props

          if (!submitOrEvent || silenceEvent(submitOrEvent)) {
            // submitOrEvent is an event: fire submit if not already submitting
            if (!this.submitPromise) {
              if (this.innerOnSubmit) {
                // will call "submitOrEvent is the submit function" block below
                return this.innerOnSubmit()
              } else {
                return this.listenToSubmit(
                  handleSubmit(
                    checkSubmit(onSubmit),
                    {
                      ...this.props,
                      ...bindActionCreators({ blur, change }, dispatch)
                    },
                    this.props.validExceptSubmit,
                    this.asyncValidate,
                    this.getFieldList({ excludeFieldArray: true })
                  )
                )
              }
            }
          } else {
            // submitOrEvent is the submit function: return deferred submit thunk
            return silenceEvents(() => {
              return (
                !this.submitPromise &&
                this.listenToSubmit(
                  handleSubmit(
                    checkSubmit(submitOrEvent),
                    {
                      ...this.props,
                      ...bindActionCreators({ blur, change }, dispatch)
                    },
                    this.props.validExceptSubmit,
                    this.asyncValidate,
                    this.getFieldList({ excludeFieldArray: true })
                  )
                )
              )
            })
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
            forceUnregisterOnUnmount,
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
            validExceptSubmit,
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
            ...(propNamespace
              ? { [propNamespace]: reduxFormProps }
              : reduxFormProps),
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
        forceUnregisterOnUnmount: PropTypes.bool,
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
          const {
            form,
            getFormState,
            initialValues,
            enableReinitialize,
            keepDirtyOnReinitialize
          } = props
          const formState = getIn(getFormState(state) || empty, form) || empty
          const stateInitial = getIn(formState, 'initial')
          const initialized = !!stateInitial

          const shouldUpdateInitialValues =
            enableReinitialize &&
            initialized &&
            !deepEqual(initialValues, stateInitial)
          const shouldResetValues =
            shouldUpdateInitialValues && !keepDirtyOnReinitialize

          let initial = initialValues || stateInitial || empty

          if (shouldUpdateInitialValues) {
            initial = stateInitial || empty
          }

          let values = getIn(formState, 'values') || initial

          if (shouldResetValues) {
            values = initial
          }

          const pristine = shouldResetValues || deepEqual(initial, values)
          const asyncErrors = getIn(formState, 'asyncErrors')
          const syncErrors = getIn(formState, 'syncErrors') || {}
          const syncWarnings = getIn(formState, 'syncWarnings') || {}
          const registeredFields = getIn(formState, 'registeredFields')
          const valid = isValid(form, getFormState, false)(state)
          const validExceptSubmit = isValid(form, getFormState, true)(state)
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
            initialized,
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
            validExceptSubmit,
            warning
          }
        },
        (dispatch, initialProps) => {
          const bindForm = actionCreator =>
            actionCreator.bind(null, initialProps.form)

          // Bind the first parameter on `props.form`
          const boundFormACs = mapValues(formActions, bindForm)
          const boundArrayACs = mapValues(arrayActions, bindForm)
          const boundBlur = (field, value) =>
            blur(initialProps.form, field, value, !!initialProps.touchOnBlur)
          const boundChange = (field, value) =>
            change(
              initialProps.form,
              field,
              value,
              !!initialProps.touchOnChange,
              !!initialProps.persistentSubmitErrors
            )
          const boundFocus = bindForm(focus)

          // Wrap action creators with `dispatch`
          const connectedFormACs = bindActionCreators(boundFormACs, dispatch)
          const connectedArrayACs = {
            insert: bindActionCreators(boundArrayACs.arrayInsert, dispatch),
            move: bindActionCreators(boundArrayACs.arrayMove, dispatch),
            pop: bindActionCreators(boundArrayACs.arrayPop, dispatch),
            push: bindActionCreators(boundArrayACs.arrayPush, dispatch),
            remove: bindActionCreators(boundArrayACs.arrayRemove, dispatch),
            removeAll: bindActionCreators(
              boundArrayACs.arrayRemoveAll,
              dispatch
            ),
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

        get fieldList() {
          // mainly provided for testing
          return this.refs.wrapped.getWrappedInstance().getFieldList()
        }

        get wrappedInstance() {
          // for testine
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
