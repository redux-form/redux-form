# Selecting Form Values Example

There may be times when, in your form component, you would like to have access to the values of 
some of the fields in your form. To get them, you will need to `connect()` directly to the form
values in the Redux store. To facilitate this common use case, `redux-form` provides a convenient
selector via the 
[`formValueSelector`](https://redux-form.com/6.3.0/docs/api/FormValueSelector.md/)
API.

**WARNING**: Use this method sparingly, as it will cause your _entire_ form to re-render every 
time one of the values you are selecting changes.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:selectingFormValues` or manually run the
following commands:
```
cd ./examples/selectingFormValues
npm install
npm start
```

Then open [`localhost:3030`](http://localhost:3030) in your
browser to view the example running locally on your machine.

## Usage

The selector is used in two steps, because the first step will generally apply to all the further
usages.

First you create a selector by giving your form name:

```js
const selector = formValueSelector('myFormName')
```

This will create a function that will get any value from that form from the global Redux state.
Then you can either request a single value from the global state, with

```js
const value = selector(state, 'fieldName')
```

OR, you may select multiple values, by passing additional field names.

```js
const values = selector(state, 'street', 'city', 'postalCode')
```

which would give you an object, like:

```js
{
  street: '1600 Pennsylvania Avenue',
  city: 'Washington, D.C.',
  postalCode: '20500'
}
```
