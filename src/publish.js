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
    console.error(error)
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
  console.error('No version specified!')
  process.exit(1)
}

const promises = []
const publish = (pages, breadcrumbs = []) =>
  forIn(pages, ({ file, title, children }, path) => {
    promises.push(fetch(file)
      .then(response => mkdir(path.substring(1))
        .then(() => writeFile(
          path.length > 1 ? `${path.substring(1)}/index.html` : 'index.html',
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
    console.info('Done!')
    process.exit(0)
  })
