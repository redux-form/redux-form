# Does `redux-form` work with React Native?
  
Yes, it does.

#### If your are using all `react-native@18+`, `redux@4+` and `npm@3+`

Just import it as usual:

```javascript
import {reduxForm} from 'redux-form';
```

#### Else

All you have to do is use:

```javascript
import {reduxForm} from 'redux-form/native';
```
instead of
```javascript
import {reduxForm} from 'redux-form';
```

#### Note:

`react-redux/native` is deprecated in `react-redux@4+`, it only appears in `react-redux@3`

#### See Also:

1. [[react-native] Depend on npm "react" instead of shipping with a vendored copy #2985](https://github.com/facebook/react-native/issues/2985)
2. [[react-redux] Update React Native installation instructions #236](https://github.com/rackt/react-redux/issues/236)
3. [Until React Native works on top of React instead of shipping a fork of React, you’ll need to keep using React Redux 3.x branch and documentation.](https://github.com/erikras/redux-form/issues/473#issuecomment-167690524)
