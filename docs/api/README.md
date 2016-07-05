# API

## [`reduxForm(config:Object)`](ReduxForm.md)

> The decorator you use to connect your form component to Redux.
[See details](ReduxForm.md).

---
  
## [`reducer`](Reducer.md)

> The form reducer. Should be given to mounted to your Redux state at `form`.

> ### [`reducer.plugin(Object<String, Function>)`](ReducerPlugin.md)

> Returns a form reducer that will also pass each action through additional reducers specified.

---
  
## [`props`](Props.md)

> The props passed into your decorated form component.

---
  
## [`Field`](Field.md)

> The component needed to connect any input to `redux-form`.

---
  
## [`FieldArray`](FieldArray.md)

> The component needed to render an array of fields

---
  
## [`formValueSelector(form:String, [getFormState:Function])`](FormValueSelector.md)

> Creates a selector for use in `connect()`ing to form values in the Redux store.

---
  
## [`SubmissionError`](SubmissionError.md)

> A special error type for returning submit validation errors

---
  
## [Action Creators](ActionCreators.md)

> `redux-form` exports all of its internal action creators.

---
