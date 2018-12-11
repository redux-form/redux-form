const insertLine = require('insert-line')

// Sorry you had to come look at this. It's embarrassing.
// This abomination is to get around https://github.com/facebook/immutable-js/issues/1564

const patch = line =>
  insertLine('node_modules/immutable/dist/immutable.js.flow')
    .content('// $FlowFixMe')
    .at(line)

const run = async () => {
  await patch(406)
  await patch(387)
  process.exit()
}

run()
