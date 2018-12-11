# Flow Typing

`redux-form` supports static typing with [Flow](https://flow.org). Flow should
automatically import the types when you import the components and functions from
`redux-form`. In addition, you may import types for all the props provided by
`redux-form` to your components.

If you ignore your `node_modules` folder inside your `.flowconfig`, the types will not import and you will receive an error:

```
  3: import { Field, reduxForm } from 'redux-form'
                                      ^^^^^^^^^^^^ redux-form. Required module not found
```

Inside your `.flowconfig`, ensure the entire folder is not ignored:

```
...
[ignore]
  <PROJECT_ROOT>/node_modules/editions  # you can still selectively ignore packages that cause flow errors
[include]
...
```

## Props Types

This will give you the types of the
[`props`](http://redux-form.com/8.0.1/docs/api/Props.md/) that will be injected
into your decorated form component by the `reduxForm()` higher order component.

### `FormProps`

```jsx
import type { FormProps } from 'redux-form'

type Props = {
  someCustomThing: string
} & FormProps
// ^^^^^^^^^^

class MyForm extends React.Component {
  props: Props

  render() {
    const { handleSubmit, someCustomThing } = this.props
    return <form onSubmit={handleSubmit}>// fields here</form>
  }
}
```

### `FieldProps`

This will give you the shape of the props provided from
[`Field`](http://redux-form.com/8.0.1/docs/api/Field.md/) to your field
component.

```jsx
import type { FieldProps } from 'redux-form'

const renderField = ({ input, meta, ...rest } : FieldProps) =>
//                                           ^^^^^^^^^^^^^
  <div>
    <input {...input} {...rest}/>
    {meta.touched && meta.error && <div>{meta.error}</div>}
  </div>

...

<Field name="myField" component={renderField}/>
```

### `FieldsProps`

This will give you the shape of the props provided from
[`Fields`](http://redux-form.com/8.0.1/docs/api/Fields.md/) to your fields
component.

```jsx
import type { FieldsProps } from 'redux-form'

const renderField = (fields : FieldsProps) =>
//                         ^^^^^^^^^^^^^^
  <div>
    {fields.map(({ input, meta, ...rest }) =>
      <div>
        <input {...input} {...rest}/>
        {meta.touched && meta.error && <div>{meta.error}</div>}
      </div>)
    }
  </div>

...

<Fields names={[ 'firstField', 'secondField' ]} component={renderFields}/>
```

### `FieldArrayProps`

This will give you the shape of the props provided from
[`FieldArray`](http://redux-form.com/8.0.1/docs/api/FieldArray.md/) to your
field array component.

```jsx
import type { FieldArrayProps } from 'redux-form'

const renderFieldArray = ({ fields } : FieldArrayProps) =>
//                             ^^^^^^^^^^^^^^^^^^
  <ul>
    {fields.map((name, index, fields) => (
      <li key={index}>
        <Field
          name={`${name}.firstName`}
          type="text"
          component={renderField}
          label="First Name"/>
        <Field
          name={`${name}.lastName`}
          type="text"
          component={renderField}
          label="Last Name"/>
      </li>
    ))}
  </ul>

...

<FieldArray name="contacts" component={renderFieldArray}/>
```
