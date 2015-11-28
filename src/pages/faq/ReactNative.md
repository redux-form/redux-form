<ol class="breadcrumb">
  <li><a href="#/">Redux Form</a></li>
  <li><a href="#/faq">FAQ</a></li>
  <li class="active">Does `redux-form` work with React Native?</li>
</ol>

# Does `redux-form` work with React Native?
  
Yes, it does. All you have to do is use:

```javascript
import {reduxForm} from 'redux-form/native';
```
instead of
```javascript
import {reduxForm} from 'redux-form';
```
