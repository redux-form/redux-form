import React from 'react'
import fs from 'fs'
import { Markdown, render } from 'redux-form-website-template'
import { createFetch, base, accept, parseText } from 'http-client'
import mkdirp from 'mkdirp'
import forIn from 'lodash.forin'

const fetch = createFetch(
  base('https://raw.githubusercontent.com/erikras/redux-form/master'),
  accept('text/plain'),
  parseText()
)

const makeCallback = (resolve, reject) => error => {
  if (error) {
    console.error(error)  // eslint-disable-line
    reject(error)
  } else {
    resolve()
  }
}
const mkdir = path =>
  new Promise((resolve, reject) => {
    if (path) {
      mkdirp(path, makeCallback(resolve, reject))
    } else {
      resolve()
    }
  })
const writeFile = (path, contents) =>
  new Promise((resolve, reject) => fs.writeFile(path, contents, makeCallback(resolve, reject)))


const version = process.argv[ 2 ]
if (!version) {
  console.error('No version specified!')  // eslint-disable-line
  process.exit(1)
}

const promises = []
const publish = (pages, breadcrumbs = []) =>
  forIn(pages, ({ file, title, children }, path) => {
    const dest = `${version}${path}`
    promises.push(fetch(file)
      .then(response => mkdir(dest)
        .then(() => writeFile(
          path.length > 1 ? `${dest}/index.html` : `${version}/index.html`,
          render({
            component: <Markdown content={response.textString}/>,
            path,
            title,
            version,
            breadcrumbs: [ ...breadcrumbs, { path, title } ]
          })))))
    if (children) {
      publish(children, [ ...breadcrumbs, { path, title } ])
    }
  })

const pages = JSON.parse(fs.readFileSync('pages.json').toString())
publish(pages)
Promise.all(promises)
  .then(() => {
    console.info('Done!')  // eslint-disable-line
    process.exit(0)
  })
