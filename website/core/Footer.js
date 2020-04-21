/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    const docsUrl = this.props.config.docsUrl
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
    const langPart = `${language ? `${language}/` : ''}`
    return `${baseUrl}${docsPart}${langPart}${doc}`
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + (language ? `${language}/` : '') + doc
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('doc1.html', this.props.language)}>Getting Started</a>
            <a href={this.docUrl('doc3.html', this.props.language)}>API Reference</a>
            <a href={this.docUrl('doc2.html', this.props.language)}>FAQ</a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://stackoverflow.com/questions/ask?tags=redux-form"
              target="_blank"
              rel="noreferrer noopener"
            >
              Stack Overflow
            </a>
            <a href="https://spectrum.chat/redux-form">Spectrum</a>
            <a href="https://gitter.im/erikras/redux-form">Gitter</a>
          </div>
          <div>
            <h5>More</h5>
            {this.props.config.twitterUsername && (
              <div className="social">
                <a
                  href={`https://twitter.com/${this.props.config.twitterUsername}`}
                  className="twitter-follow-button"
                >
                  Follow @{this.props.config.twitterUsername}
                </a>
              </div>
            )}
            {this.props.config.facebookAppId && (
              <div className="social">
                <div
                  className="fb-like"
                  data-href={this.props.config.url}
                  data-colorscheme="dark"
                  data-layout="standard"
                  data-share="true"
                  data-width="225"
                  data-show-faces="false"
                />
              </div>
            )}
            <iframe
              key="github-stars"
              title="github-stars"
              src="https://ghbtns.com/github-btn.html?user=redux-form&repo=redux-form&type=star&count=true&size=large"
              frameborder="0"
              scrolling="0"
              width="160px"
              height="30px"
            />
            <div>
              <a href="https://www.netlify.com" target="_blank">
                <img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg" />
              </a>
            </div>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    )
  }
}

module.exports = Footer
