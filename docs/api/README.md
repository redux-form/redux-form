# API

## [`reduxForm(config:Object)`](ReduxForm.md)

> The decorator you use to connect your form component to Redux.
[See details](ReduxForm.md).

---
  
## [`reducer`](Reducer.md)

> The form reducer. Should be given to mounted to your Redux state at `form`.

> ### [`reducer.syncValidation(Object<String, Object<String, Function>>)`](ReducerSyncValidation.md)

> Returns a form reducer that will also run the synchronous validation function given for each 
form name.

---
  
## [`props`](Props.md)

> The props passed into your decorated form component.

---
  
## [`Field`](Field.md)

> The component needed to connect any input to `redux-form`.

---
  
## [`SubmissionError`](SubmissionError.md)

> A special error type for returning submit validation errors

---
  
## [Action Creators](ActionCreators.md)

> `redux-form` exports all of its internal action creators.

---
