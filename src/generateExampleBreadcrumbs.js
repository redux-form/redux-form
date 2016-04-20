const generateExampleBreadcrumbs = (slug, title, version) =>
  [
    { path: `http://redux-form.com/${version}/`, title: 'Redux Form' },
    { path: `http://redux-form.com/${version}/examples`, title: 'Examples' },
    { path: `http://redux-form.com/${version}/examples/${slug}`, title }
  ]

export default generateExampleBreadcrumbs
