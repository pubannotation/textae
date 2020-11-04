import path from 'path'

export default function (fileName) {
  return path.extname(fileName) === '.txt'
}
