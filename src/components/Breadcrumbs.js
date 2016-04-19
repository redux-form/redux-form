import React from 'react'
import marked from 'marked'
import styles from './Breadcrumbs.scss'

const formatTitle = title => /<p>(.+)<\/p>/.exec(marked(title))[1]

const Breadcrumbs = ({ items }) => {
  if (!items || !items.length) {
    return false
  }
  return (
    <ol className={styles.breadcrumbs}>
      {items.map(({path, title}, index) =>
        index === items.length - 1 ?
          <li key={index} dangerouslySetInnerHTML={{ __html: formatTitle(title) }}/> :
          <li key={index}><a href={path} dangerouslySetInnerHTML={{ __html: formatTitle(title) }}/></li>
      )}
    </ol>
  )
}

export default Breadcrumbs
