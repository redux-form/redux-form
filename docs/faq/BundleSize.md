# How to reduce  `redux-form`'s bundle size?

For convenience, Redux Form exposes its full API on the top-level `redux-form` import. 
However, this causes the entire Redux Form library and its dependencies to be included in client bundles that 
include code that imports from the top-level import.

Instead, the bindings exported from `redux-form` are also available in `redux-form/lib` and `redux-form/es`. 
You can import directly from those to avoid pulling in unused modules. 

Example:
```js
import { reduxForm, Field, FieldArray } from 'redux-form'
```

use:

```js
import reduxForm from 'react-router/es/reduxForm'
import Field from 'react-router/es/Field'
import FieldArray from 'react-router/es/FieldArray'
```


Use `es` if you are using a bundler that can process ES modules like `webpack@2` or `rollup`, otherwise use `lib`.

The public API available in this manner is defined as the set of imports available from the top-level `react-router` module.
Anything not available through the top-level `redux-form` module is a private API, and is subject to change without notice.

## Babel Plugin

Thankfully there is a babel plugin that can automate this task.


[babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports)


```json
    {
        "plugins": [
            ["transform-imports", {
                "redux-form": {
                  "transform": "redux-form/es/${member}",
                  "preventFullImport": true
                }
            }]
        ]
    }
```

##Caveat (Action Creators)

Action creators are available under `actions` in order to take advantage of this method.
One would import the actions binding and then extract the needed action creators.

Example:

```
import actions from 'react-router/es/actions'

const {change, destroy} = actions
```