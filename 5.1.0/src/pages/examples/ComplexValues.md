With `redux-form`, your form values can also be arrays or objects. The notation in the `fields` list is very 
important, so pay attention to the following:

* If you want an array of fields, as seen in the [Deep Form example](#/examples/deep), you must put a `[]` (e.g. 
`children[]`) at the end of your field name. 

* If you want single field that has an array as a value, you simply use the field name with no brackets (e.g. 
`children`) and set the value to an array using a custom component.

Which you choose depends on whether you want to have a custom input to edit your array or want `redux-form` to do it 
for you, as in the [Deep Form example](#/examples/deep).

This example uses a quick and dirty custom component, `ObjectSelect`, that serializes and deserializes the values to 
and from JSON. It is recommended that you use a more sophisticated component.
