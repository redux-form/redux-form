import React, {Component} from 'react';
import prettify from '../util/prettify';

const markdownPage = markdown =>
  class MarkdownPage extends Component {
    componentDidMount() {
      PR.prettyPrint();
    }

    render() {
      return <div className="container markdown" dangerouslySetInnerHTML={{__html: prettify(markdown)}}/>;
    }
  };

export default markdownPage;
