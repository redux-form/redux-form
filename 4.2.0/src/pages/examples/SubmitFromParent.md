Sometimes you may want to have your `Submit` button outside of your decorated `redux-form`
component. `redux-form` exposes a `submit()` method on the decorated component, allowing you to 
accomplish this. All you need to do is add a `ref` prop to your component, and then access it via
`this.refs.whateverRefYouGaveIt`. Calling `submit()` from outside the form component is exactly 
the same as calling it from inside, e.g. it won't call your `onSubmit` handler if there are 
validation errors, etc.

The example below also has a "Clear Values" button which dispatches a `RESET` action, via the 
exported `reset()` action creator.
