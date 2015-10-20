import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Simple extends Component {
  render() {
    const styles = require('./Home.scss');
    return (<div className={styles.home}>
      <div className="container">
        <h1>Simple Example</h1>


      </div>
    </div>);
  }
}
