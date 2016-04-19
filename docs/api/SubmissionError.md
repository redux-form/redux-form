# `SubmissionError`

A throwable error that is used to return submit validation errors from `onSubmit`. The purpose
being to distinguish promise rejection because of validation errors from promise rejection because
of AJAX I/O problems or other server errors.

## Importing

```javascript
var SubmissionError = require('redux-form').SubmissionError;  // ES5
```
```javascript
import { SubmissionError } from 'redux-form';  // ES6
```

## Usage

```js
<MyForm onSubmit={values =>
  ajax.send(values) // however you send data to your server...
    .catch(error => {
      // how you pass server-side validation errors back is up to you
      if(error.validationErrors) {
        throw new SubmissionError(error.validationErrors)
      } else {
        // what you do about other communication errors is up to you
      }
    })
}/>
```

