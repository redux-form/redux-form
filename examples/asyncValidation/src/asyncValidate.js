const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function composeAsyncValidators(validatorFns) {
  return async (values, dispatch, props, field) => {
    const validatorFn = validatorFns[field]
    await validatorFn(values, dispatch, props, field);
  };
}

const usernameValidate = (values /*, dispatch */) => {
  return sleep(1000).then(() => { // simulate server latency
    console.log('asyncValidate username')
    if (['john', 'paul', 'george', 'ringo'].includes(values.username)) {
      throw { username: 'That username is taken' };
    }
  });
};

const companynameValidate = (values /*, dispatch */) => {
  return sleep(1000).then(() => { // simulate server latency
    console.log('asyncValidate companyname')
    if (['google','amazon','tesla'].includes(values.companyname)) {
      throw { companyname: 'That companyname is taken' };
    }
  });
};

const asyncValidate = composeAsyncValidators({
  username:usernameValidate,
  companyname:companynameValidate
});

export default asyncValidate;
