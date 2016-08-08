import _validate from 'redux-validate'

const validate =
  _validate(
    [ 'clubName', 'members[].firstName','members[].lastName', 'members[].hobbies[]' ],
    'Required')
  .then(
    'members<._error>',
    members => (!members || !members.length) && 'At least one member must be entered')
  .then(
    'members[].hobbies<._error>',
    hobbies => hobbies && hobbies.length > 5 && 'No more than five hobbies allowed')

export default validate
