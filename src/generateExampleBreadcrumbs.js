const generateExampleBreadcrumbs = (slug, title, version) =>
  [
    { path: `https://redux-form.com/${version}/`, title: 'Redux Form' },
    { path: `https://redux-form.com/${version}/examples`, title: 'Examples' },
    { path: `https://redux-form.com/${version}/examples/${slug}`, title }
  ]

export default generateExampleBreadcrumbs
