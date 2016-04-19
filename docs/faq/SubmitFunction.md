# My submit function isn't being called! Help?

Possible causes:

* Your synchronous validation function is not returning `{}`. Probably because:
  * You are upgrading from a previous version of `redux-form` that required that `{valid: true}` be returned.
  * You have removed a field from your form, but forgotten to remove it from your validation function.
* Your asynchronous validation function is returning a rejected promise for some reason.
