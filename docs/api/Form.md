# `Form`

The `Form` component is a simple wrapper for the React `<form>` component that allows
the surrounding `redux-form`-decorated component to trigger its `onSubmit` function.

It is only useful if you are:

- performing your submission from inside your form component by passing
  `onSubmit={this.props.handleSubmit(this.mySubmitFunction)}` to your `<form>`
  component
- **AND EITHER:**
  - initiating your submission via the [`submit()` Instance API](http://redux-form.com/6.6.0/docs/api/ReduxForm.md/#-submit-promise-) (i.e. calling it directly on a reference to your decorated form component)
  - initiating your submission by [dispatching the `submit(form)` action](http://redux-form.com/6.6.0/examples/remoteSubmit/)

If you are passing in your `onSubmit` function as a config parameter or prop, this component will do nothing for you.

## Importing

```javascript
var Form = require('redux-form').Form;  // ES5
```
```javascript
import { Form } from 'redux-form';  // ES6
```
## Props you can pass to `Form`

Any that you can pass to `<form>`, but only one is required.

### `onSubmit : Function` [required]

> The function to call when form submission is triggered.

## Usage

All you do is replace your `<form>` with `<Form>`.