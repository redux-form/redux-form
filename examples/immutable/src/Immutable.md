# Immutable JS Example

Using `redux-form` with [Immutable JS](http://facebook.github.io/immutable-js/) could not be
easier. By default, `redux-form` uses plain javascript objects to store its state in Redux, but 
if you are using a library, like [`redux-immutable`](https://github.com/gajus/redux-immutable) or
[`redux-immutablejs`](https://github.com/indexiatech/redux-immutablejs) to keep your Redux state 
with Immutable JS, you can use the "immutable" version of `redux-form` by importing from 
`redux-form/immutable` instead of `redux-form`.

```js
import { reduxForm } from 'redux-form/immutable'
```

**IMPORTANT**: When you are using the immutable version of `redux-form`, the values that 
`redux-form` gives you for validation and submission will be in an `Immutable.Map`.

This is because proper use of Immutable JS involves doing as little `toJS`/`fromJS` conversions as 
possible, and `redux-form` does not know or care which form you want your data in, so it gives it
to you in the form that it is stored.

