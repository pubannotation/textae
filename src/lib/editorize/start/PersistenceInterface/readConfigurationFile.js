import readFile from './readFile'
import isJSON from './isJSON'
import DataSource from '../../DataSource'

export default function (file, editor) {
  readFile(file).then(({ target }) => {
    if (isJSON(target.result)) {
      editor.eventEmitter.emit(
        'textae-event.resource.configuration.load.success',
        new DataSource('local file', file.name, JSON.parse(target.result))
      )
    } else {
      editor.eventEmitter.emit(
        'textae-event.resource.configuration.format.error',
        new DataSource('local file', file.name)
      )
    }
  })
}
