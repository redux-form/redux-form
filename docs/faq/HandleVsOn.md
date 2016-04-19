# What's the difference between `handleSubmit` and `onSubmit`?

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
