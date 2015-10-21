import React, {Component, PropTypes} from 'react';

/**
 * Formats code with CDN-loaded Google's code-prettify - https://github.com/google/code-prettify
 */
class Code extends Component {
  static propTypes = {
    children: PropTypes.any,
    language: PropTypes.string
  }

  static defaultProps = {
    language: 'javascript'
  }

  componentDidMount() {
    this.pretty();
  }

  componentDidUpdate() {
    this.pretty();
  }

  pretty() {
    // This is disgusting, but the 'prettyprinted' class that code-prettify puts on the
    // DOM node must be removed, or it won't re-prettify on component update.
    const {props: {language}, refs: {code}} = this;
    code.className = `prettyprint lang-${language}`;
    PR.prettyPrint();
  }

  render() {
    return (<pre className="code-block">
      <code ref="code">{this.props.children}</code>
    </pre>);
  }
}

export default Code;
