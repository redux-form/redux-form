import _validate from 'redux-validate'

const validate = _validate([ 'username', 'password' ], 'Required')

export default validate
