import isJSON from '../../../isJSON'
import loadAnnotation from '../../loadAnnotation'
import DataSource from '../../DataSource'
import alertifyjs from 'alertifyjs'
import SimpleInlineTextAnnotation from 'simple-inline-text-annotation'

export default function readAnnotationText(eventEmitter, text, format) {
  if (format === 'json') {
    if (isJSON(text)) {
      loadAnnotation(eventEmitter, JSON.parse(text))
    } else {
      eventEmitter.emit(
        'textae-event.resource.annotation.format.error',
        DataSource.createInstantSource()
      )
    }
  } else if (format === 'inline') {
    try {
      const annotation = SimpleInlineTextAnnotation.parse(text)

      loadAnnotation(eventEmitter, annotation)
    } catch {
      const dataSource = DataSource.createInstantSource()
      alertifyjs.error(
        `Failed to load annotation from ${dataSource.displayName}.`
      )
    }
  }
}
