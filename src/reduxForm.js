import React, {Component, PropTypes} from 'react';
import {blur, change, initialize, reset, touch, touchAll, untouch, untouchAll} from './actions';
import {getDisplayName, isPristine} from './util';

/**
 * @param sliceName The key in the state corresponding to the data in this form
 * @param validate [optional] A validation function that takes all the data and returns all the errors
 */
export default function reduxForm(sliceName, validate = () => ({})) {
  return DecoratedComponent =>
    class ReduxForm extends Component {
      static displayName = `ReduxForm(${getDisplayName(DecoratedComponent)})`;
      static DecoratedComponent = DecoratedComponent;
      static propTypes = {
        sliceName: PropTypes.string,
        form: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
      }
      static defaultProps = {
        sliceName
      }

      render() {
        const {form, sliceName, dispatch, ...passableProps} = this.props; // eslint-disable-line no-shadow
        passableProps.dispatch = dispatch; // we want to allow dispatch through
        const handleBlur = (name) => (event) => dispatch(blur(sliceName, name, event.target.value));
        const handleChange = (name) => (event) => dispatch(change(sliceName, name, event.target.value));
        const pristine = isPristine(form.initial, form.data);
        const errors = validate(form.data);
        const valid = !Object.keys(errors).length;
        return (<DecoratedComponent
          data={form.data}
          dirty={!pristine}
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          initializeForm={data => dispatch(initialize(sliceName, data))}
          invalid={!valid}
          pristine={pristine}
          resetForm={() => dispatch(reset(sliceName))}
          touch={(...fields) => dispatch(touch(sliceName, ...fields))}
          touched={form.touched}
          touchAll={() => dispatch(touchAll(sliceName))}
          untouch={(...fields) => dispatch(untouch(sliceName, ...fields))}
          untouchAll={() => dispatch(untouchAll(sliceName))}
          valid={valid}
          {...passableProps}/>); // pass other props
      }
    };
}
