import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Simple extends Component {
  render() {
    const styles = require('./Home.scss');
    return (<div className={styles.home}>
      <h1>Home page</h1>
      <Link to="/simple">Simple example</Link>
    </div>);
  }
}
