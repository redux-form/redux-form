import { SubmissionError } from 'redux-form'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function submit(values) {
  return sleep(1000) // simulate server latency
    .then(() => {
      if (![ 'john', 'paul', 'george', 'ringo' ].includes(values.username)) {
        throw new SubmissionError({ username: 'User does not exist', _error: 'Login failed!' })
      } else if (values.password !== 'redux-form') {
        throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' })
      } else {
        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
      }
    })
}

export default submit
