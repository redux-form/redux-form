# Understanding Field Value Lifecycle

It's important to understand how your field value is flowing through `redux-form`.

## Value Lifecycle Hooks

`redux-form` provides three value lifecycle hooks, provided as props to the `Field` component.
**They are all optional.**

### `format(value:Any) => Any`

> Formats the value from the Redux store to be used for your input component. Common use cases are
> for maintaining data as `Number`s or `Date`s in the store, but formatting them a specific way in
> your input.

### `parse(value:Any) => Any`

> Parses the input by the user into the data type that you want to use in the Redux store.
> Common use cases are for maintaining data as `Number`s or `Date`s in the store.

### `normalize(value:Any, previousValue:Any, allValues:Object, previousAllValues:Object) => Any`

> Allows you to add logic based on all your form values to put a constraint on the value of the
> current field. Common use cases include making sure that `minDate` is before `maxDate`. If you
> have provided a parser, the value given to `normalize()` will already be parsed.

## Value Lifecycle

<div style="text-align: center;">
<img align="center" src="https://github.com/erikras/redux-form/raw/master/docs/valueLifecycle.png"/>
</div>
