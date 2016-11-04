# Remote Submit Example

This example demonstrates how a form may be submitted by dispatching a `SUBMIT` action from an
unrelated component or middleware.

The "Submit" button you see here is not connected to the form component in any way; it only 
dispatches an action via Redux.

Notice that for this to work, the submit function must be given to the form component via either 
a config value passed to `reduxForm()` or via a prop.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:remoteSubmit` or manually run the
following commands:
```
cd ./examples/remoteSubmit
npm install
npm start
```

## How to use the form below:

* Usernames that will pass validation: `john`, `paul`, `george`, or `ringo`.
* Valid password for all users: `redux-form`.

