This example demonstrates a quirk when using `React` and `redux-form` with File input types.

If you've tried setting up `redux-form` with a File field, you may have encountered a browser error like the following:

* <i class="fa fa-chrome"></i> Chrome: `Uncaught DOMException: Failed to set the 'value' property on 'HTMLInputElement': This input element accepts a filename, which may only be programmatically set to the empty string.`

* <i class="fa fa-firefox"></i> FireFox: `SecurityError: The operation is insecure.`

* <i class="fa fa-safari"></i> Safari: `Error: InvalidStateError: DOM Exception 11`

As a security precaution, inputs of `type="file"` do not support setting the `value` property programmatically<sup>[1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#File_inputs)</sup>.

To avoid this warning, you may remove the `value` property from the associated file field present in the `fields` prop that `redux-form` provides to your wrapped component.

As seen in the [Simple](#/examples/simple) example, for most input types it is sufficient to spread the properties passed in by `redux-form`:

```javascript
// see other examples for complete code samples
const { fields: { firstName } } = this.props
// ...
<input type="text" placeholder="First Name" {...firstName}>
```

However, when working with File inputs it's necessary to first remove the `value` property or explicitly set it to `null` to prevent `React` from trying to set the `value` property on the DOM Input Element:

```javascript
const {fields: {avatar}} = this.props
// ...
<input type="file" {...avatar} value={null}>
```

In this case, `redux-form` will still keep track of the `FileList` associated with the input but `React` won't attempt to wrongly set a the input's `value` when it re-renders.

In the below example, the value of the avatar field as managed by `redux-form` is negated by the presence of `value={ null }` appearing *after* the properties are spread out from the `fields` prop. An alternative would be to use ES6 "[rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)" to remove `value` while keeping everything else together:

```javascript
let {value:_, ...avatar} = this.props.fields.avatar
```

**Note**: `resetForm` will not behave exactly as you might expect due to the browser security constraints described above. As a result, when clearing a `redux-form` (via `resetForm`) it's impossible for React to update the file inputs' DOM state. This means there is necessarily a disconnect between the file input's state represented in the DOM and the form state that `redux-form` keeps track of.

Finally, a note about serializing objects. The `FileList` object returned from the file input stringifies to `{}` similarly to `RegExp` objects (because there is no canonical string representation). This just means if you are serializing `redux-form` state you may need to write custom `replacer` and `reviver` functions for `JSON.stringify` and `JSON.parse` respectively.

The custom `replacer` function rendering JSON below looks like:

```javascript
function replacer(key, value) {
  if (value instanceof FileList) {
    return Array.from(value).map(file => file.name).join(', ') || 'No Files Selected';
  }
  return value;
}

function stringify(values) {
  return JSON.stringify(values, replacer, 2);
}
```
