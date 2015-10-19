import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Home extends Component {
  render() {
    const styles = require('./Simple.scss');
    const logo = require('./logo.svg');
    return (<div className={styles.simple}>
      <h1>Home page</h1>
      <img src={logo} width="500"/>
      <Link to="/simple">Simple example</Link>
    </div>);
  }
}
