<ol class="breadcrumb">
  <li><a href="#/">Redux Form</a></li>
  <li><a href="#/faq">FAQ</a></li>
  <li class="active">How can I submit my form when the users presses Enter?</li>
</ol>

# How can I submit my form when the users presses Enter?
  
The default browser behavior for `text` and `password` inputs when ↵ is pressed is to activate the first `<button>`
that does not have `type="button"` specified. The recommended way to structure your form is as follows:

```javascript
render() {
  const {fields: {firstName, lastName}, handleSubmit} = this.props.fields;
  return (
    <form onSubmit={handleSubmit}>
      <button type="button">Load Data</button>
      <button type="button">Delete Record</button>
      
      <label>First Name</label>
      <input type="text" {...firstName}/>
      
      <label>Last Name</label>
      <input type="text" {...lastName}/>
      
      <button type="submit">Submit</button>
      <button type="button">Do Something Else</button>
    </form>
  );
}
```

Things to notice:

1. `handleSubmit` is on the `<form>` element, not on the `<button>`. It does not hurt to put it on the `onClick` for 
the button, but it doesn't accomplish anything.
2. The submit button is explicitly marked `type="submit"`.
3. You may place any other buttons inside the form as long as they are labeled `type="button"`.
