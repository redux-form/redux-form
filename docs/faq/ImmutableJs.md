# Does `redux-form` work ImmutableJS?
  
Yes!

As of `v6`, `redux-form` has support for ImmutableJS built in.

Simply import from a different endpoint and all of `redux-form`'s internal state will be kept 
with ImmutableJS data structures.

Instead of...
```js
import { reduxForm } from 'redux-form'
```

...do...

```js
import { reduxForm } from 'redux-form/immutable'
```

That's all there is to it!
