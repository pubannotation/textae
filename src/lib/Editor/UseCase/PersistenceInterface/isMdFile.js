import path from 'path-browserify'

export default function (fileName) {
  return path.extname(fileName) === '.md'
}
