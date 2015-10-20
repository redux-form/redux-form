import React, {Component} from 'react';
import readme from 'redux-form/README.md';
import prettify from '../util/prettify';
import GithubButton from '../components/GithubButton';

export default class Home extends Component {
  componentDidMount() {
    pretty();
    PR.prettyPrint();
  }

  render() {
    const styles = require('./Home.scss');
    return (<div className={styles.home}>
      <div className={styles.masthead}>
        <div className={styles.logo}/>
        <h1>Redux Form</h1>

        <h2>The best way to manage your form state in Redux.</h2>
        <GithubButton user="erikras"
                      repo="redux-form"
                      type="star"
                      width={160}
                      height={30}
                      count large/>
        <GithubButton user="erikras"
                      repo="redux-form"
                      type="fork"
                      width={160}
                      height={30}
                      count large/>
      </div>
      <div className="container markdown" dangerouslySetInnerHTML={{ __html: prettify(readme) }}/>
    </div>);
  }
}
