import React from 'react'
import GithubButton from './GithubButton'

const Home = ({ version }) => {
  const styles = require('./Home.scss')
  return (<div className={styles.home}>
    <div className={styles.masthead}>
      <div className={styles.logo}/>
      <h1>Redux Form</h1>
      <div className={styles.version}>v{version}</div>

      <h2>The best way to manage your form state in Redux.</h2>
      <GithubButton
        user="erikras"
        repo="redux-form"
        type="star"
        width={160}
        height={30}
        count
        large/>
      <GithubButton
        user="erikras"
        repo="redux-form"
        type="fork"
        width={160}
        height={30}
        count large/>
    </div>
    <div className={styles.options}>
      <a href="docs/GettingStarted.md">
        <i className={styles.start}/>
        Start Here
      </a>
      <a href="docs/api">
        <i className={styles.api}/>
        API
      </a>
      <a href="docs/faq">
        <i className={styles.faq}/>
        FAQ
      </a>
    </div>
  </div>)
}

export default Home
