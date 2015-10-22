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
[See details](#/api/reducer).

> ### [`reducer.normalize(Object<String, Object<String, Function>>)`](#/api/reducer/normalize)

> Returns a form reducer that will also pass each form value through the normalizing functions provided.
[See details](#/api/reducer/normalize).

> ### [`reducer.plugin(Object<String, Function>)`](#/api/reducer/plugin)

> Returns a form reducer that will also pass each action through additional reducers specified.
[See details](#/api/reducer/plugin).

---
  
## [`props`](#/api/props)

> The props passed into your decorated form component.
[See details](#/api/props).

---
  
## [Action Creators](#/api/action-creators)

`redux-form` exports all of its internal action creators.
[See details](#/api/action-creators).

---
