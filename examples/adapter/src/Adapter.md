# Adapter Example

The "adapter" API in `redux-form` provides an easy way to provide shortcuts to certain commonly 
used ways of rendering inputs. An "adapter" function, in `redux-form`, takes a string that 
corresponds to the `component` prop on the `Field` component, and the props that `redux-form` 
would normally give to the `component`, and gives back a React element. To write that more 
succinctly in code:

```js
const adapter = (componentName, props) => <MyCustomComponent {...props}/>
```

The adapter API is provided for convenience only, as you could always pass predefined components
or stateless function components to your `component` prop. The primary motivation for the adapter
interface is to allow third party input libraries to provide easy ways to adapt popular third
party input widgets to `redux-form`. e.g.
[`redux-form-material-ui`](https://github.com/erikras/redux-form-material-ui).

The example below is fairly contrived, and is meant only to demonstrate how it works and the kind
of flexibility the adapter API provides. It should not necessarily be copied.
