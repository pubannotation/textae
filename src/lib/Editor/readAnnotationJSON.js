import DataSource from './DataSource'
import isJSON from '../isJSON'

export default function readAnnotationJSON(eventEmitter, text) {
  if (isJSON(text)) {
    const annotation = JSON.parse(text)
    if (annotation.text) {
      eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        new DataSource('instant', null, annotation)
      )
      return true
    }
  }

  return false
}
