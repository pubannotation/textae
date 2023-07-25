import isJSON from '../../../isJSON'
import loadAnnotation from '../../loadAnnotation'

export default function readAnnotationText(eventEmitter, text) {
  if (!isJSON(text)) {
    return false
  }

  return loadAnnotation(eventEmitter, JSON.parse(text))
}
