# Fixed immutable array reducer bug

## Description
Allowed pushing, unshifting, and inserting of `undefined` into a field array. Previously, after a `push()`, the value passed to your input would be `{}` instead of `''`.

Made arrays be `Immutable.List` when using `redux-form/immutable`.

## Issue
Fixes #1574
