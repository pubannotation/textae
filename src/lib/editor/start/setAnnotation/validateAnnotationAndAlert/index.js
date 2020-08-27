import alertifyjs from 'alertifyjs'
import hasDuplicatedAttributes from './hasDuplicatedAttributes'
import areNotBeginAndEndInteger from './areNotBeginAndEndInteger'

export default function validateAnnotationAndAlert(annotation) {
  const duplicatedAttributes = hasDuplicatedAttributes(annotation)
  if (duplicatedAttributes.size) {
    for (const [key, duplicatedAttribute] of duplicatedAttributes.entries()) {
      alertifyjs.error(
        `${key} has duplicate attributes ${duplicatedAttribute.map(
          (a) => `"${a}"`
        )}.`
      )
    }
    return false
  }

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
