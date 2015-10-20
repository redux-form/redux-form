const prettify = html => html.replace(/ class="?lang-([^">]+)"?/g, ' class="prettyprint lang-$1"');

export default prettify;
