# React Widgets Example

This is a simple demonstration of how to connect react-widgets
[react-widgets](https://github.com/jquense/react-widgets) form elements to `redux-form`.

For the most part, it is a matter of wrapping each form control in a `<Field>` component as custom component. For rest of things you should read `react-widgets` docs. 

For all controls we need to  simulate the `onChange` and `onBlur` manually. 

The delay between when you click "Submit" and when the alert dialog pops up is intentional,
to simulate server latency.


# Issue

* Currently there is a warning error for MultiSelect value as the component expect value to be an array. We will be looking more into it.


# Some Gotcha

* React-widgets is bound with some css , please do not consider this example with css. We have tricked the css.
* Goal of this exmaple is how can we connect `react-widgets` to `redux-form`
* This example is using `style-loader`,`file-loader`,`url-loader` as it has its own css to maniupate.
* For more details of what `react-widgets` can do and how to setup `react-widgets` go through their [documentation](https://jquense.github.io/react-widgets/docs/#/?_k=mmahpo)

# Initializing Form from state

There is no extra trick to Initialize form for more information please look to InitializeFormState example.
