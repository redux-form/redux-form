<ol class="breadcrumb">
  <li><a href="#/">Redux Form</a></li>
  <li><a href="#/faq">FAQ</a></li>
  <li class="active">Will `redux-form` work with a my custom input component?</li>
</ol>

# Will `redux-form` work with a my custom input component?
  
The minimum interface needed for a custom component to work with `redux-form` is to make sure that `value` and 
`onChange` are passed properly. These are pretty standard prop names, so it's possible that your component will work 
right out of the box.

But let's say that you have a custom component called `MyStrangeInput` that has `currentValue` and `thingsChanged`
props that expect the value to be wrapped in an object under a `val` key. You would have to do something like:

```javascript
render() {
  const {myField} = this.props.fields;
  return (
    <div>
      <MyStrangeInput 
        currentValue={{val: myField.value}}
        thingsChanged={param => myField.onChange(param.val)}/>
    </div>
  );
}
```

The point is that almost any input can be adjusted to use `redux-form`. If you are using an input component with a 
non-standard interface many times in your application, it is recommended that you wrap it in another component that 
will allow you to do the normal field destructuring: `<AdaptedInput {...myField}/>`.
