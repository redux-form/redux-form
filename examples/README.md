# Examples

Below are a list of examples that demonstrate the capabilities of `redux-form` for testing and
learning purposes.

Each example is its own standalone web app with hot reloading. To prepare for running the
examples locally, clone the `redux-form` repository and run `npm install` to install the
necessary dependencies for `redux-form`. Then you can run the examples locally using either
two methods:

1. Run `npm run example:EXAMPLE_FOLDER` (Remember to replace EXAMPLE\_FOLDER with the name of the 
folder for the example you want to run like `npm run example:simple` or `npm run example:material-ui`)

2. Manually run the following commands:
```
# Remember to replace EXAMPLE_FOLDER with the name of the example's folder
cd ./examples/EXAMPLE_FOLDER
npm install
npm start
```

After following either of these methods, open [`localhost:3030`](http://localhost:3030) in your
browser to view the example running locally on your machine.


---

### [Simple Form](simple)

> The simplest form. Demonstrates how to attach standard inputs to Redux.

---
  
### [Synchronous Validation](syncValidation)

> How to add synchronous client-side validation to your form.

---
  
### [Submit Validation](submitValidation)

> How to return server-side validation errors back from your submit function.

---
  
### [Asynchronous Blur Validation](asyncValidation)

> How to run asynchronous server-side validation on your form when certain fields lose focus.

---
  
### [Initializing From State](initializeFromState)

> How to initialize your form data from any slice of the Redux state.

---

### [Field Arrays](fieldArrays)

> How to create and manipulate arrays of fields.

---

### [Remote Submit](remoteSubmit)

> How to use submit your form via a dispatched Redux action.

---

### [Normalizing](normalizing)

> How to use normalize your form values.

---

### [Immutable JS](immutable)

> How to use Immutable JS for `redux-form` state storage.

---

### [Selecting Form Values](selectingFormValues)

> How to bind certain form values as props to your entire form component.

---

### [Wizard Form](wizard)

> How to create a multi-page "wizard" form.

---

### [Material-UI Examples](material-ui)

> Contains multiple Material-UI examples

---

### [React-Widgets Examples](react-widgets)

> How to use `react-widgets` components with `redux-form` 

---
