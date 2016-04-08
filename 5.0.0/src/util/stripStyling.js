const stripStyling = html => html.replace(/\ (className|style)=["{][^"}]+["}]["}]?/g, '')

export default stripStyling
