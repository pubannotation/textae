import SimpleInlineTextAnnotation from '@pubann/simple-inline-text-annotation'
import alertifyjs from 'alertifyjs'

import isJSON from '../../../isJSON'
import DataSource from '../../DataSource'
import loadAnnotation from '../../loadAnnotation'

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
