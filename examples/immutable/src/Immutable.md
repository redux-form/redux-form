# Immutable JS Example

Using `redux-form` with [Immutable JS](http://facebook.github.io/immutable-js/) could not be
easier. By default, `redux-form` uses plain javascript objects to store its state in Redux, but 
if you are using a library, like [`redux-immutable`](https://github.com/gajus/redux-immutable) or
[`redux-immutablejs`](https://github.com/indexiatech/redux-immutablejs) to keep your Redux state 
with Immutable JS, you can use the "immutable" version of `redux-form` by importing from 
`redux-form/immutable` instead of `redux-form`.

Also do not forget to import your form reducer from `redux-form/immutable` as well.

```js
import { reduxForm } from 'redux-form/immutable'
```

**IMPORTANT**: When you are using the immutable version of `redux-form`, the values that 
`redux-form` gives you for validation and submission will be in an `Immutable.Map`.

This is because proper use of Immutable JS involves doing as little `toJS`/`fromJS` conversions as 
possible, and `redux-form` does not know or care which form you want your data in, so it gives it
to you in the form that it is stored.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:immutable` or manually run the
following commands:
```
cd ./examples/immutable
npm install
npm start
```

Then open [`localhost:3030`](http://localhost:3030) in your
browser to view the example running locally on your machine.

