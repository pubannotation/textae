import alertifyjs from 'alertifyjs'
import areNotBeginAndEndInteger from './areNotBeginAndEndInteger'

export default function validateAnnotationAndAlert(annotation) {
  const isThereNonIntegerValue = areNotBeginAndEndInteger(annotation)
  if (isThereNonIntegerValue) {
    alertifyjs.warning(
      `In the annotation file, some of the begin and end offsets of denotations were not integer values.
      TextAE converted them to integer values.
      However, to avoid a chance of unexpected rendering, please fix them.`,
      15
    )
  }

  return true
}
