# Wizard Form

One common UI design pattern is to separate a single form out into sepearate pages of inputs,
commonly known as a Wizard. There are several ways that this could be accomplished using
`redux-form`, but the simplest and recommended way is to follow these instructions:

* Connect each page with `reduxForm()` to the same form name.
* Specify the `destroyOnUnmount: false` flag to preserve form data across form component unmounts.
* You may specify sync validation for the entire form
* Use `onSubmit` to transition forward to the next page; this forces validation to run.

Things that are up to you to implement:

* Call destroyForm() manually after a successful submit.