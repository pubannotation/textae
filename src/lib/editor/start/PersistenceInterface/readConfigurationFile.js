import readFile from './readFile'
import isJSON from './isJSON'

export default function (files, editor) {
  const file = files[0]

  readFile(file).then(({ target }) => {
    if (isJSON(target.result)) {
      editor.eventEmitter.emit(
        'taxtae-event.data-access-object.configuration.load.success',
        'local file',
        file.name,
        JSON.parse(target.result)
      )
    } else {
      editor.eventEmitter.emit(
        'taxtae-event.data-access-object.configuration.load.error',
        'local file',
        file.name
      )
    }
  })
}
