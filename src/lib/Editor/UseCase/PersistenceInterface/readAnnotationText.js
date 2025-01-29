import isJSON from '../../../isJSON'
import loadAnnotation from '../../loadAnnotation'
import InlineAnnotationConverter from '../../InlineAnnotationConverter'
import DataSource from '../../DataSource'
import alertifyjs from 'alertifyjs'

export default async function readAnnotationText(eventEmitter, text, format) {
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
      const annotation = await new InlineAnnotationConverter(
        'https://pubannotation.org/conversions/inline2json'
      ).toJSON(text)

      loadAnnotation(eventEmitter, annotation)
    } catch {
      alertifyjs.error(`Failed to load annotation as inline format.`)
    }
  }
}
