# Using Redux Middlware

If you can't return a promise to the `onSubmit` method (because you're using some redux middleware to perform your side effects), instead trigger the stopSubmit action when your server side validation has failed.

Pass `stopSubmit` as a parameter the key of your form and an error object, use `_error` to indicate a generic error, rather than an error with a specific field. 
