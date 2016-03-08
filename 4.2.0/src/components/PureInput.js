import React, {Component, PropTypes} from 'react';

export default class PureInput extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field;
  }

  render() {
    const {field, ...rest} = this.props;
    return <input {...field} {...rest}/>;
  }
}
