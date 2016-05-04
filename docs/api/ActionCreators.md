# Action Creators

`redux-form` exports all of its internal action creators, allowing you complete control to
dispatch any action you wish. However, it is recommended that you use the actions passed as
props to your component for most of your needs, as they are already bound to `dispatch`, your 
form, and, in the case of field-specific actions such as `CHANGE` or `BLUR`, the specific field.

### `arrayInsert(form:String, field:String, index:Number, value:any)`

> Inserts an item into a field array at the specified index

### `arrayPop(form:String, field:String)`

> Removes an item from the end of a field array

### `arrayPush(form:String, field:String, value:any)`

> Appends an item to the end of a field array

### `arrayRemove(form:String, field:String, index:Number)`

> Removes an item at the specified index from a field array

### `arrayShift(form:String, field:String)`

> Removes an item from the beginning of a field array

### `arraySplice(form:String, field:String, index:Number, removeNum:Number, value:any)`

> **ADVANCED USAGE** - Inserts and/or removes items from a field array. Works similarly to 
[`Array.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

### `arraySwap(form:String, field:String, indexA:Number, indexB:Number)`

> Swaps two items at the specified indexes in a field array

### `arrayUnshift(form:String, field:String, value:any)`

> Inserts an item at the beginning of a field array

### `blur(form:String, field:String, value:any)`

> Saves the value to the field.

### `change(form:String, field:String, value:any)`

> Saves the value to the field.

### `destroy(form:String)`

> Destroys the form, removing all its state.

### `focus(form:String, field:String)`

> Marks the given field as `active` and `visited`.

### `initialize(form:String, data:Object, fields:Array<String>)`

> Sets the initial values in the form with which future data values will be compared to calculate
`dirty` and `pristine`. The `data` parameter may contain deep nested array and object values that match the shape of 
your form fields. **IMPORTANT:** The fields array passed must be the same as the one given as a [config parameter to
`reduxForm()`](#/api/reduxForm).

### `reset(form:String)`

> Resets the values in the form back to the values past in with the most recent `initialize` action.

### `startAsyncValidation(form:String)`

> Flips the `asyncValidating` flag `true`.

### `startSubmit(form:String)`

> Flips the `submitting` flag `true`.

### `stopSubmit(form:String, errors:Object)`

> Flips the `submitting` flag `false` and populates `submitError` for each field.

### `stopAsyncValidation(form:String, errors:Object)`

> Flips the `asyncValidating` flag `false` and populates `asyncError` for each field.

### `touch(form:String, ...fields:String)`

> Marks all the fields passed in as `touched`.

### `untouch(form:String, ...fields:String)`

> Resets the 'touched' flag for all the fields passed in.
