# How do I `mapStateToProps` or `mapDispatchToProps`?

Better to show with an example:

```javascript
import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

class Example extends React.Component {
  // ...
}

const mapStateToProps = state => ({
  // ...
})

const mapDispatchToProps = dispatch => ({
  // ...
})

Example = connect(
  mapStateToProps,
  mapDispatchToProps
)(Example)

export default reduxForm({
  form: 'example' // a unique name for this form
})(Example)
```
