<ol class="breadcrumb">
  <li><a href="#/">Redux Form</a></li>
  <li class="active">API</li>
</ol>

# API

## [`reduxForm(config:Object)`](#/api/reduxForm)

> The decorator you use to connect your form component to Redux.
[See details](#/api/reduxForm).

---
  
## [`reducer`](#/api/reducer)

> The form reducer. Should be given to mounted to your Redux state at `form`.

> ### [`reducer.normalize(Object<String, Object<String, Function>>)`](#/api/reducer/normalize)

> Returns a form reducer that will also pass each form value through the normalizing functions provided.

> ### [`reducer.plugin(Object<String, Function>)`](#/api/reducer/plugin)

> Returns a form reducer that will also pass each action through additional reducers specified.

---
  
## [`props`](#/api/props)

> The props passed into your decorated form component.

---
  
## [Action Creators](#/api/action-creators)

`redux-form` exports all of its internal action creators.

---
  
## [`getValues()`](#/api/get-values)

`redux-form` exports a `getValues(state)` function to let you read the values directly from the Redux state

---
