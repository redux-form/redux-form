module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  root.find(j.ObjectTypeAnnotation, { inexact: false, exact: false }).forEach(path => {
    path.node.inexact = true
  })
  return root.toSource()
}

module.exports.parser = 'flow'
