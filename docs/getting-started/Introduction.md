---
id: introduction
title: Introduction
sidebar_label: Introduction
---

The basic implementation of `redux-form` is simple. However, to make the most of
it, it's recommended to have basic knowledge on:

- [Redux](https://redux.js.org/) state container,
- [React](https://facebook.github.io/react/) and
  [Higher-Order Components (HOCs)](https://facebook.github.io/react/docs/higher-order-components.html).

## Overview

To connect your React form components to your Redux store you'll need the following
pieces from the `redux-form` package:

- Redux Reducer: `formReducer`,
- React HOC `reduxForm()` and `<Field/>` component.

It's important to understand their responsibilities:

|               | type        | responsibility                                                                                                                                                   |
| ------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formReducer` | _reducer_   | function that tells how to update the Redux store based on changes coming from the application; those changes are described by Redux actions                     |
| `reduxForm()` | _HOC_       | function that takes configuration object and returns a new function; use it to wrap your `form` component and bind user interaction to dispatch of Redux actions |
| `<Field/>`    | _component_ | component that lives inside your wrapped `form` component; use it to connect the input components to the `redux-form` logic                                      |

## Data flow

The diagram below represents the simplified data flow. Note that in most cases
you don't need to worry about the
[action creators](https://redux-form.com/8.2.2/docs/api/ActionCreators.md/) for
yourself, as they're already bound to dispatch for certain actions.

<div style="text-align: center;">
  <img src="https://github.com/redux-form/redux-form/raw/master/docs/reduxFormDiagram.png" width="500" style="max-width: 100%;"/>
</div>

Let's go through a simple example. We have a form component wrapped with
`reduxForm()`. There is one text input inside, wrapped with `<Field/>`. The data
flows like this:

1.  User clicks on the input,
2.  "Focus action" is dispatched,
3.  `formReducer` updates the corresponding state slice,
4.  The state is then passed back to the input.

Same goes for any other interaction like filling the input, changing its state
or submitting the form.

With `redux-form` comes a lot more: hooks for validation and formatting
handlers, various properties and action creators. This guide describes the basic
usage – feel free to dig deeper.
