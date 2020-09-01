import readFile from './readFile'
import isJSON from './isJSON'

export default function(files, editor) {
  const file = files[0]

  readFile(file).then((event) => {
    if (isJSON(event.target.result)) {
      editor.eventEmitter.emit(
        'textae.configuration.load',
        'local file',
        file.name,
        JSON.parse(event.target.result)
      )
    } else {
      editor.eventEmitter.emit(
        'textae.configuration.loadError',
        'local file',
        file.name
      )
    }
  })
}
