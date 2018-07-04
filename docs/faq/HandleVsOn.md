# What's the difference between `handleSubmit` and `onSubmit`?

From what I can tell from every example I have seen, there is an unwritten rule in the React community about handling form events:

> **`handleX` is what you name the function that you pass to the `onX` prop.**

```javascript
render() {
  const handleClick = () => console.log('Clicked!');
  return <button onClick={handleClick}>Click me</button>;
}
```

```javascript
render() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted!');
  }
  return <button onClick={handleSubmit}>Click me</button>;
}
```

## How do I pass form value(s) to my own submit handler?

redux-form covers `handleSubmit` functionality by [providing a respective handler](https://github.com/zacacollier/redux-form/blob/master/src/handleSubmit.js) that you pass as a prop - that is, a `handleSubmit` method for you to pass to `onSubmit`.

With that in mind, you can think of the redux-form `handleSubmit` as a middle layer for your form's `submit` handler. Simply write your components as you normally would, passing `handleSubmit` where appropriate:

```javascript
import React from 'react';
import { reduxForm, Field } from 'redux-form';

const SearchBar = ({ handleChange, handleSubmit, value }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Field
        component="input"
        name="search"
        onChange={handleChange}
        type="text"
        value={value}
      />
    </div>
  </form>
)
export default reduxForm({ form: 'SearchBar' })(SearchBar)
```

You can access your form's input values via the `values` parameter provided to the `onSubmit` prop:

```javascript
import React from 'react';
import { connect } from 'react-redux';
import SearchBar from './SearchBar';

let SearchContainer = ({ handleSearchSubmit, values }) => 
  <SearchBar
    onSubmit={values => handleSearchSubmit(values.search)}
  />

const mapDispatchToProps = (dispatch) => ({
  handleSearchSubmit: value => dispatch({ type: 'SEARCH_CONTAINER_SUBMIT', payload: value }),
});

export default connect(null, mapDispatchToProps)(SearchContainer);
```

That's it! No need to specify `event.preventDefault()`. All that's left to do is handle the dispatched form data in your reducer.
