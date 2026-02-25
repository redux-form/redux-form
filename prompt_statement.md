I'm encountering an issue with `FieldArray` when using `redux-form/immutable`. When I push `undefined` into the array, the value passed to the input is an empty object `{}` instead of an empty string `''`.

Also, it seems that arrays are not consistently being treated as `Immutable.List` when using the immutable version of the library.

Can you please investigate and fix this?
