Any component decorated with `reduxForm()` may be used multiple times on a single page by passing in a `formKey` 
prop, which will be used as a unique key for a nested object in the Redux state. Each instance will be connected only
to its Redux state slice.

The following demo generates random band names and initializes multiple copies of `BandForm`. The wrapping component,
`BandsForm`, keeps a collection of bands and updates its state when `onSubmit` is fired from one of the `BandForm`s.

