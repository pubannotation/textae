import readFile from './readFile'
import isJSON from './isJSON'

export default function (files, editor) {
  const file = files[0]

  readFile(file).then(({ target }) => {
    if (isJSON(target.result)) {
      editor.eventEmitter.emit(
        'textae-event.configuration.load',
        'local file',
        file.name,
        JSON.parse(target.result)
      )
    } else {
      editor.eventEmitter.emit(
        'textae-event.configuration.loadError',
        'local file',
        file.name
      )
    }
  })
}
