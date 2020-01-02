# `ReduxFormContext`

[`View source on GitHub`](https://github.com/redux-form/redux-form/blob/master/src/ReduxFormContext.js)

`ReduxFormContext` is a `React.Context` that allows to hook into parent `redux-form`. All this `redux-form` components use `ReduxFormContext` to hook into parent form.

- `Field`
- `FieldArray`
- `Fields`
- `FormValues`
- `FormName`
- `FormSection`

`ReduxFormContext` has a `ReduxFormContext.Provider` and a `ReduxFormContext.Consumer`

### `ReduxFormContext.Provider`

Can be used to extend a `redux-form`, but this has to be done inside a `redux-form`, otherwise the `value` will be `null`.  
Ex: `FormSection` component is using `Provider` to extend parent `redux-form`

### `ReduxFormContext.Consumer`

Can be used to create implementation of a custom `Field` or other components that depend on a parent `redux-form`.  
`Consumer` should be inside a `redux-form` that provides the `ReduxFormContext.Provider`, otherwise the render prop argument will be `null`

## Importing

```javascript
var ReduxFormContext = require('redux-form').ReduxFormContext // ES5
```

```javascript
import { ReduxFormContext } from 'redux-form' // ES6
```

## Usage

### `ReduxFormContext.Provider`

```tsx
import React from 'react'
import { ReduxFormContext, reduxForm, Context } from 'redux-form'

const withReduxForm = reduxForm({ form: 'form-name' })

const ExtendReduxForm = withReduxForm(props => (
  <ReduxFormContext.Consumer>
    {(reduxForm: Context) => (
      <ReduxFormContext.Provider
        {...props}
        value={{
          ...reduxForm
          // extend
        }}
      />
    )}
  </ReduxFormContext.Consumer>
))

const ExtendReduxFormUsingHooks = withReduxForm(props => {
  const reduxForm: Context = React.useContext(ReduxFormContext)

  return (
    <ReduxFormContext.Provider
      {...props}
      value={{
        ...reduxForm
        // extend
      }}
    />
  )
})

const ExtendWithoutParentReduxForm = props => (
  <ReduxFormContext.Consumer>
    {/* here `reduxForm` will be `null` because no parent `redux-form` */}
    {(reduxForm: Context) => (
      <ReduxFormContext.Provider
        {...props}
        value={{
          ...reduxForm
          // extend
        }}
      />
    )}
  </ReduxFormContext.Consumer>
)
```

### `ReduxFormContext.Consumer`

```tsx
import React from 'react'
import { ReduxFormContext, reduxForm, Context } from 'redux-form'

const CustomField = (props) => (
  <ReduxFormContext.Consumer>
    {(reduxForm: Context) => /* render */}
  </ReduxFormContext.Consumer>
)

const Form = reduxForm({ form: 'form-name' })((props) => (
  <form onSubmit={props.handleSubmit}>
    <CustomField />
  </form>
))
```
