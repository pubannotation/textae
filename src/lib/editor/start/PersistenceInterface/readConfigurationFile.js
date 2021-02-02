import readFile from './readFile'
import isJSON from './isJSON'

export default function (files, editor) {
  const file = files[0]

  readFile(file).then(({ target }) => {
    if (isJSON(target.result)) {
      editor.eventEmitter.emit(
        'taxtae-event.annotation-data.configuration.load.success',
        'local file',
        file.name,
        JSON.parse(target.result)
      )
    } else {
      editor.eventEmitter.emit(
        'taxtae-event.annotation-data.configuration.load.successError',
        'local file',
        file.name
      )
    }
  })
}
