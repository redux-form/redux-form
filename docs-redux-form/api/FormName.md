# `FormName`

The `FormName` component allows you to get the name of the form in context - the name given to the enclosing `reduxForm` wrapper.
It is a [render props component](https://reactjs.org/docs/render-props.html).
This can be useful for building reusable components that show the status of any form in your app, for example.

## Importing

```javascript
var FormName = require('redux-form').FormName // ES5
```

```javascript
import { FormName } from 'redux-form' // ES6
```

## Props you can pass to `FormName`

### `children : (props: { form: string }) => React.Node` [required]

`FormName` will call this `children` function with the name of the enclosing form, and render whatever this function returns.
