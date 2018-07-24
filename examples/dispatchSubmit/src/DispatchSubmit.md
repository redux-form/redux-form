# Dispatch Submit Example

This example demonstrates how to submit a form through custom Redux action.

When prop `submitAsSideEffect` is set to `true` result of `onSubmit` function will be dispatched as action.
Difference with the regular submit flow is such that this will not trigger any submission lifecycles (submission start, finish or error).
Presubmit validations still must be passed before submission.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:dispatchSubmit` or manually run the
following commands:

```
cd ./examples/dispatchSubmit
npm install
npm start
```

## How to use the form below:

- Usernames that will pass submit validation: `john`, `paul`, `george`, or `ringo`.
- Valid password for all users: `redux-form`.
- Buttons will emit actions of different types
