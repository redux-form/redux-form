# FAQ

Below is a list of common problems that people have using `redux-form`.

## 1) My submit function isn't being called! Help?

Possible causes:

* Your synchronous validation function is not returning `{}`. Probably because:
  * You are upgrading from a previous version of `redux-form` that required that `{valid: true}` be returned.
  * You have removed a field from your form, but forgotten to remove it from your validation function.
* Your asynchronous validation function is returning a rejected promise for some reason.

## 2) What's the difference between `handleSubmit` and `onSubmit`?

From what I can tell from every example I have seen, there is an unwritten – until now! – rule in the React community:

> **handleX is what you name the function that you pass to the onX prop.**

```javascript
render() {
  const handleClick = () => console.log('Clicked!');
  return <button onClick={handleClick}>Click me</button>;
}
```

Since the only way that redux-form can provide you with functionality is to pass it as a prop, it passes you a
`handleSubmit` for you to pass to `onSubmit`.
