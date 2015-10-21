const stripClasses = html => html.replace(/\ className=["{][^"}]+["}]/g, '');

export default stripClasses;
