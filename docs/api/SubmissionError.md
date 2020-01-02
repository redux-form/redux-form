# `SubmissionError`

[`View source on GitHub`](https://github.com/redux-form/redux-form/blob/master/src/SubmissionError.js)

A throwable error that is used to return submit validation errors from `onSubmit`. The purpose
being to distinguish promise rejection because of validation errors from promise rejection because
of AJAX I/O problems or other server errors. If it is rejected in the form of
{ field1: 'error', field2: 'error' } then the submission errors will be added
to each field (to the error prop) just like async validation errors are.
If there is an error that is not specific to any field, but applicable to the
entire form, you may pass that as if it were the error for a field called \_error,
and it will be given as the error prop.

## Importing

```javascript
var SubmissionError = require('redux-form').SubmissionError // ES5
```

```javascript
import { SubmissionError } from 'redux-form' // ES6
```

## Usage

```js
<MyForm
  onSubmit={values =>
    ajax
      .send(values) // however you send data to your server...
      .catch(error => {
        // how you pass server-side validation errors back is up to you
        if (error.validationErrors) {
          throw new SubmissionError(error.validationErrors)
        } else {
          // what you do about other communication errors is up to you
        }
      })
  }
/>
```
