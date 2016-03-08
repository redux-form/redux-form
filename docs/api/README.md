# API

## [`reduxForm(config:Object)`](ReduxForm.md)

> The decorator you use to connect your form component to Redux.
[See details](ReduxForm.md).

---
  
## [`reducer`](Reducer.md)

> The form reducer. Should be given to mounted to your Redux state at `form`.

> ### [`reducer.normalize(Object<String, Object<String, Function>>)`](ReducerNormalize.md)

> Returns a form reducer that will also pass each form value through the normalizing functions provided.

> ### [`reducer.plugin(Object<String, Function>)`](ReducerPlugin.md)

> Returns a form reducer that will also pass each action through additional reducers specified.

---
  
## [`props`](Props.md)

> The props passed into your decorated form component.

---
  
## [Action Creators](ActionCreators.md)

`redux-form` exports all of its internal action creators.

---
  
## [`getValues()`](GetValues.md)

`redux-form` exports a `getValues(state)` function to let you read the values directly from the Redux state

---
