# Why are all my buttons triggering `onSubmit`?

You may want to add a 'reset' or 'cancel' button to your form. When doing so, be wary of the `type` property passed to your `<button/>`. This can cause all buttons within your form to trigger `onSubmit`.

`<button/>` elements are automatically associated with parent `<form/>` elements:

> If *[the `form` property]* is not specified, the `<button>` element will be associated to an ancestor `<form>` element, if one exists.

The default `type` property assigned to `<button/>` elements is `submit`. This causes the button to attempt to trigger their parent form's `onSubmit` handler, regardless of the button's own click handler. By changing `type` to `button`, your button will trigger your passed event handler instead of trying to submit the form.

For more information, refer to the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button).
