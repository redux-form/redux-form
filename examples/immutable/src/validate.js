import _validate from 'redux-validate'

const validate = values => {
  values = values.toJS()
  return _validate([ 'username', 'email', 'age' ], 'Required')
    .then({
      username: username => username && username.length > 15 && 'Must be 15 characters or less',
      email: email => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) &&
        'Invalid email address',
      age: age => isNaN(Number(age)) && 'Must be a number'
    })
    .then('age', age => Number(age) < 18 && 'Sorry, you must be at least 18 years old')(
    values)
}

export default validate
