# Instructions for new contributors

- Make a fork of https://github.com/erikras/redux-form and a branch off that fork
- Install deps: `npm install`
- Change the code to implement your feature/fix
- When you're ready to commit run flow typechecker: `npm run test:flow`
- And the full test suite: `npm run test`
- And/or check the test coverage: `npm run test:cov` (this will check if you've added any new code that is not exercised by the test suite)
- The pre-commit hooks should do a sanity-check build
- Once committed, pull request your branch into https://github.com/erikras/redux-form
