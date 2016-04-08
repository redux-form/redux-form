import generateBandName from './generateBandName'

const generateBands = num => {
  const result = []
  for (let index = 0; index < num; index++) {
    result.push({
      id: index + 1,
      name: generateBandName(),
      color: Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase()
    })
  }
  return result
}

export default generateBands
