# Action Creators

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/actions.js)

`redux-form` exports all of its internal action creators, allowing you complete control to
dispatch any action you wish. However, it is recommended that you use the actions passed as
props to your component for most of your needs, as they are already bound to `dispatch`, your
form, and, in the case of field-specific actions such as `CHANGE` or `BLUR`, the specific field.

### `arrayInsert(form:String, field:String, index:Number, value:any)`

> Inserts an item into a field array at the specified index

### `arrayMove(form:String, field:String, from:Number, to:Number)`

> Moves an item from one index in the array to another. In effect, it performs a remove and an
insert, so the item already at the `to` position will be bumped to a higher index, not overwritten.

### `arrayPop(form:String, field:String)`

> Removes an item from the end of a field array

### `arrayPush(form:String, field:String, value:any)`

> Appends an item to the end of a field array

### `arrayRemove(form:String, field:String, index:Number)`

> Removes an item at the specified index from a field array

### `arrayRemoveAll(form:String, field:String)`

> Removes all the items from the specified array.

### `arrayShift(form:String, field:String)`

> Removes an item from the beginning of a field array

### `arraySplice(form:String, field:String, index:Number, removeNum:Number, value:any)`

> **ADVANCED USAGE** - Inserts and/or removes items from a field array. Works similarly to
[`Array.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

### `arraySwap(form:String, field:String, indexA:Number, indexB:Number)`

> Swaps two items at the specified indexes in a field array

### `arrayUnshift(form:String, field:String, value:any)`

> Inserts an item at the beginning of a field array

### `autofill(form:String, field:String, value:String)`

> Saves the value to the field and sets its `autofilled` property to `true`.

### `blur(form:String, field:String, value:any)`

> Saves the value to the field.

### `change(form:String, field:String, value:any)`

> Saves the value to the field.

### `clearSubmitErrors(form:String)`

> Removes `submitErrors` and `error`.

### `clearFields(form:String, keepTouched: boolean, persistentSubmitErrors: boolean, ...fields:String)`

> Cleans fields values for all the fields passed in.

> If the `keepTouched` parameter is `true`, the values of currently touched fields will be retained
> If the `persistentSubmitErrors` parameter is `true`, the values of currently submit errors fields will be retained


### `destroy(...forms:String)`

> Destroys the forms, removing all of their state.

### `focus(form:String, field:String)`

> Marks the given field as `active` and `visited`.

### `initialize(form:String, data:Object, [keepDirty:boolean], [options:{keepDirty:boolean, keepSubmitSucceeded:boolean, updateUnregisteredFields:boolean}])`

> Sets the initial values in the form with which future data values will be compared to calculate
`dirty` and `pristine`. The `data` parameter may contain deep nested array and object values that match the shape of
your form fields.

> If the `keepDirty` parameter is `true`, the values of currently dirty fields will be retained
to avoid overwriting user edits.  (`keepDirty` can appear as either the third argument, or a property of `options` as
the 3rd or 4th argument, for the sake of backwards compatibility).

> If the `keepSubmitSucceeded` parameter is `true`,
it will not clear the `submitSucceeded` flag if it is set.

> If the `updateUnregisteredFields` parameter is `true`,
it will update every initialValue if still pristine instead of only registered fields.
Highly recommended, defaults to false because of non-breaking backwards compatibility. 

### `registerField(form:String, name:String, type:String)`

> Registers a field with the form. The `type` parameter can be `Field` or `FieldArray`.

### `reset(form:String)`

> Resets the values in the form back to the values past in with the most recent `initialize` action.

### `setSubmitFailed(form:String, ...fields:String)`

> Flips `submitFailed` flag `true`, removes `submitSucceeded` and `submitting`, marks all the fields passed in as `touched`, and if at least one field was passed flips `anyTouched` to `true`.

### `setSubmitSucceeded(form:String)`

> Flips `submitSucceeded` flag `true` and removes `submitFailed`.

### `startAsyncValidation(form:String)`

> Flips the `asyncValidating` flag `true`.

### `startSubmit(form:String)`

> Flips the `submitting` flag `true`.

### `stopSubmit(form:String, errors:Object)`

> Flips the `submitting` flag `false` and populates `submitError` for each field.

### `stopAsyncValidation(form:String, errors:Object)`

> Flips the `asyncValidating` flag `false` and populates `asyncError` for each field.

### `submit(form:String)`

> Triggers a submission of the specified form.

### `touch(form:String, ...fields:String)`

> Marks all the fields passed in as `touched`.

### `unregisterField(form:String, name:String)`

> Unregisters a field with the form.

### `untouch(form:String, ...fields:String)`

> Resets the 'touched' flag for all the fields passed in.
