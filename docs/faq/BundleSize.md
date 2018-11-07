# How to reduce  `redux-form`'s bundle size?

For convenience, Redux Form exposes its full API on the top-level `redux-form` import.
However, this causes the entire Redux Form library and its dependencies to be included in client bundles that
include code that imports from the top-level import.

You can import directly from those to avoid pulling in unused modules.

Example:
```js
import { reduxForm, Field, FieldArray } from 'redux-form';
```

use:

```js
import reduxForm from 'redux-form/reduxForm';
import Field from 'redux-form/Field';
import FieldArray from 'redux-form/FieldArray';
import actions from 'redux-form/actions';
```

Note: if you are using a bundler that can process ES modules like `webpack@2` or `rollup`, it will actually
import from `redux-form/es` because of the `"modules.root": "./es"` entry in `redux-form/package.json`, and you will need
to make sure you have a rule to transpile those modules if building for legacy browsers.

The public API available in this manner is defined as the set of imports available from the top-level `redux-form` module.
Anything not available through the top-level `redux-form` module is a private API, and is subject to change without notice.

## Babel Plugin

Thankfully there is a babel plugin that can automate this task.


[babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports)


```json
    {
        "plugins": [
            ["transform-imports", {
                "redux-form": {
                  "transform": "redux-form/${member}",
                  "preventFullImport": true
                }
            }]
        ]
    }
```

## Caveat (Action Creators)

Action creators are available under `actions` in order to take advantage of this method.
One would import the actions binding and then extract the needed action creators.

Example:

```js
import actions from 'redux-form/actions';

const { change, destroy } = actions;
```
