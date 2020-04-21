/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

class HomeSplash extends React.Component {
  render() {
    const { siteConfig } = this.props
    const { baseUrl } = siteConfig

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    )

    const Logo = props => (
      <div className="reduxLogo">
        <img src={props.img_src} alt="Redux Form Logo" />
      </div>
    )

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
        <small>{props.tagline}</small>
      </h2>
    )

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    )

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button getStarted" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    )

    return (
      <SplashContainer>
        <div className="inner">
          <Logo img_src={`${baseUrl}img/reduxform.svg`} />
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href="#try">Get Started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    )
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig } = this.props

    return (
      <>
        <HomeSplash siteConfig={siteConfig} />
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8" />
      </>
    )
  }
}

module.exports = Index
