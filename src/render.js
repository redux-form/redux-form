import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import App from './components/App'

/*<link href="https://npmcdn.com/redux-form-website-template@${version}/dist/bundle.css"
media="screen, projection" rel="stylesheet" type="text/css"/>*/

const render = ({ component, title, path, version, breadcrumbs }) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charSet="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>Redux Form${title && ` - ${title}`}</title>
    <link href="/${version}/bundle.css"
      media="screen, projection" rel="stylesheet" type="text/css"/>
    <link href="https://fonts.googleapis.com/css?family=Lato:400,300,700" rel="stylesheet" type="text/css">
    <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
          media="screen, projection" rel="stylesheet" type="text/css"/>
    <meta itemprop="name" content="Redux Form"/>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="Redux Form"/>
    <meta property="og:site_name" content="Redux Form"/>
    <meta property="og:description" content="The best way to manage your form state in Redux."/>
    <meta property="og:image" content="logo.png"/>
    <meta property="twitter:site" content="@erikras"/>
    <meta property="twitter:creator" content="@erikras"/>
    <style type="text/css">
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    ${renderToStaticMarkup(<App {...{ version, path, breadcrumbs }}>{component}</App>)}
  <script>
    (function(i,s,o,g,r,a,m){i[ 'GoogleAnalyticsObject' ] = r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-69298417-1', 'auto');
    ga('send', 'pageview');
  </script>
  <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
  </body>
  </html>`

export default render
