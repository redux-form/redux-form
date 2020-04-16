# `FormSection`

The `FormSection` component makes it easy to split forms into smaller components that are reusable across multiple forms.
It does this by prefixing the name of `Field`, `Fields` and `FieldArray` children, at any depth, with the value specified in the `name` prop.

## Props you can pass to `FormSection`

### `name : String` [required]

> The name all child fields should be prefixed with.

### `component : String | Component` [optional]

> If you give `FormSection` more than one child element, it will be forced to create a component
> to wrap them with. You can specify what type of component you would like it to be (`div`,
> `section`, `span`). Defaults to `'div'`.

> Note that any additional props (e.g. 'className', 'style') that you pass to `FormSection` will be
> passed along to the wrapper component.

## Example usage

An example use case for `FormSection` is an order form where it's possible to enter the details of a buyer and a separate recipient.
The fields for both buyer and recipient are the same and therefore it makes sense to split this section into a component called `Party`.
Now a `Party` for example consists of fields like `givenName`, `middleName`, `surname` and `address` so again it makes sense to split
the address section into its own reusable component called `Address`.

The above description results in the following code:

```js
//Address.js
class Address extends React.Component {
    render() {
        return <div>
            <Field name="streetName" component="input" type="text"/>
            <Field name="number" component="input" type="text"/>
            <Field name="zipCode" component="input" type="text"/>
        </div>
    }
}

//Party.js
class Party extends React.Component {
    render() {
        return <div>
            <Field name="givenName" component="input" type="text"/>
            <Field name="middleName" component="input" type="text"/>
            <Field name="surname" component="input" type="text"/>
            <FormSection name="address">
                <Address/>
            </FormSection>
        </div>
    }
}

//OrderForm.js
class OrderForm extends React.Component {
    render() {
        return <form onsubmit={...}>
            <FormSection name="buyer">
                <Party/>
            </FormSection>
            <FormSection name="recipient">
                <Party/>
            </FormSection>
        </form>
    }
}
//don't forget to connect OrderForm with reduxForm()
```

The full names of the fields in the above example will end up looking something like `buyer.address.streetName` which in turn results in
the following result structure:

```js
{
    buyer: {
        givenName: "xxx",
        middleName: "yyy",
        surname: "zzz",
        address: {
            streetName: undefined,
            number: "123",
            zipCode: "9090"
        }
    },
    recipient: {
        givenName: "aaa",
        middleName: "bbb",
        surname: "ccc",
        address: {
            streetName: "foo",
            number: "4123",
            zipCode: "78320"
        }
    }
}
```

For component such as `Address` that rarely change form section name it can be benificial to make the component inherit from `FormSection`
instead of `Component` and set a default name prop as seen below:

```js
class Address extends FormSection {
  //ES2015 syntax with babel transform-class-properties
  static defaultProps = {
    name: 'address'
  }
  render() {
    return (
      <div>
        <Field name="streetName" component="input" type="text" />
        <Field name="number" component="input" type="text" />
        <Field name="zipCode" component="input" type="text" />
      </div>
    )
  }
}
//Regular syntax:
/*
Address.defaultProps = {
    name: "address"
}
*/
```
