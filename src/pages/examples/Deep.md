Here we demonstrate how `redux-form` can manage deep forms with arbitrarily deeply nested objects as well as arrays, 
or any combination of the two. The only difference is that the `fields` array has `[]` or `.` syntax. Each field that
corresponds to an input must still be enumerated in the `fields` array, but fields with a `[]` after them will be 
turned into arrays in the `fields` prop given to the decorated form.

Also demonstrated here is how a common component, `<Address/>`, can be used to render a group of fields.

The array fields can be modified by calling `addField(value?, index?)`, `removeField(index?)` and `swapFields(indexA?, indexB?)` _on the array_
inside the `fields` prop. If you do not specify an `index` in `addField(value?, index?)` or `removeField(index?)`,
they will act like `push()` and `pop()`, modifying the end of the array. Calling `swapFields(indexA?, indexB?)` with invalid indexes does not
modify the array.

Your synchronous validation function will be given the deep data structure and should return a deep data structure of
errors.

To learn how to have your actual field values to be arrays or objects, check the [Complex Values 
example](#/examples/complex).

This example also includes a "Make Form Enormous" button to the right to facilitate performance testing. To test 
without Redux DevTools, [place a `noDevTools` parameter in the
url](http://erikras.github.io/redux-form/?noDevTools#/examples/deep).
