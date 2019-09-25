# API

## [`reduxForm(config:Object)`](ReduxForm.md)

> The decorator you use to connect your form component to Redux.
> [See details](ReduxForm.md).

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reduxForm.js)

---

## [`reducer`](Reducer.md)

> The form reducer. Should be given to mounted to your Redux state at `form`.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reducer.js)

> ### [`reducer.plugin(Object<String, Function>)`](ReducerPlugin.md)

> Returns a form reducer that will also pass each action through additional reducers specified.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reducer.js#L369)

---

## [`props`](Props.md)

> The props passed into your decorated form component.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reduxForm.js#L347)

---

## [`Field`](Field.md)

> The component needed to connect any input to `redux-form`.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/Field.js)

---

## [`Fields`](Fields.md)

> The component that can connect multiple inputs to `redux-form`.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/Fields.js)

---

## [`FieldArray`](FieldArray.md)

> The component needed to render an array of fields

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/FieldArray.js)

---

## [`FormSection`](FormSection.md)

> The component needed to prefix the names of a group of fields.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/FormSection.js)

---

## [`Form`](Form.md)

> A simple wrapper for the React `<form>` component that allows
> the surrounding `redux-form`-decorated component to trigger its `onSubmit` function.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/Form.js)

---

## [`formValueSelector(form:String, [getFormState:Function])`](FormValueSelector.md)

> Creates a selector for use in `connect()`ing to form values in the Redux store.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/formValueSelector.js)

---

## [`SubmissionError`](SubmissionError.md)

> A special error type for returning submit validation errors

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/SubmissionError.js)

---

## [`ReduxFormContext`](ReduxFormContext.md)

> A react context that allows to manipulate a form in any way, can create form components

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/ReduxFormContext.js)

---

## [Action Creators](ActionCreators.md)

> `redux-form` exports all of its internal action creators.

> [`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/actions.js)

---

## [Selectors](Selectors.md)

> `redux-form` provides Redux state selectors that may be used to query the state of your forms.

> [`View source on GitHub`](https://github.com/erikras/redux-form/tree/master/src/selectors)

---
