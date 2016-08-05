import validate from 'redux-validate'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = validate({
  username: username =>
    sleep(1000) // simulate server latency
      .then(() =>
        [ 'john', 'paul', 'george', 'ringo' ].includes(username) &&
          'That username is taken'
      )
})

export default asyncValidate
