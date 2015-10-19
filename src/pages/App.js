import React, {PropTypes, Component} from 'react';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.array
  }

  render() {
    const styles = require('./App.scss');
    return (<div className={styles.app}>
      {this.props.children}
    </div>);
  }
}
