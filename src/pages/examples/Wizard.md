One common UI design pattern is to separate a single form out into sepearate pages of inputs, commonly known as a
[Wizard](http://ui-patterns.com/patterns/Wizard). There are several ways that this could be accomplished using 
`redux-form`, but the simplest and recommended way is to follow these instructions:

1. Connect each page with `reduxForm()` to the same form name.
2. Each form page, except the last, uses the `fields` array of only fields on that page.
3. Specify the `destroyOnUnmount` flag to preserve form data across form component unmounts.
4. Specify a sync validation _only for the fields on the current page_.
5. Use `onSubmit` to transition forward to the next page; this forces validation to run.
6. On the final page of the wizard, specify _all_ the `fields`, so that they will all be submitted.

Things that are up to you to implement:

* Call `destroyForm()` manually after a successful submit.
* Keeping the state of which page is currently displayed.
* Any fancy logic to move to a page with a field with a submission error.
