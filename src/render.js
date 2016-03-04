import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import App from './components/App'

console.log(renderToStaticMarkup(<App/>))

const render = ({ Component, title, version }) =>
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
      <title>Redux Form${title && `- ${title}`}</title>
      <link href="https://npmcdn.com/redux-form-website@${version}/dist/bundle.css"
        media="screen, projection" rel="stylesheet" type="text/css"/>
      <meta itemprop="name" content="Redux Form"/>
      <meta property="og:type" content="website"/>
      <meta property="og:title" content="Redux Form"/>
      <meta property="og:site_name" content="Redux Form"/>
      <meta property="og:description" content="The best way to manage your form state in Redux."/>
      <meta property="og:image" content="logo.png"/>
      <meta property="twitter:site" content="@erikras"/>
      <meta property="twitter:creator" content="@erikras"/>
  </head>
  <body>
    ${renderToStaticMarkup(<App version={version}><Component/></App>)}
  <script>
    (function(i,s,o,g,r,a,m){i[ 'GoogleAnalyticsObject' ] = r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-69298417-1', 'auto');
    ga('send', 'pageview');
  </script>
  </body>
  </html>`

export default render
