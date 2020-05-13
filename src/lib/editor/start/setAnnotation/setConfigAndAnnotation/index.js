import alertifyjs from 'alertifyjs'
import setSpanAndTypeConfig from '../../setSpanAndTypeConfig'
import areNotBeginAndEndInteger from './areNotBeginAndEndInteger'
import hasDuplicatedAttributes from './hasDuplicatedAttributes'
import validateConfigurationAndAlert from '../../validateConfigurationAndAlert'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  config,
  errorMessageForConfigValidation
) {
  const [isValid, patchedConfig] = validateConfigurationAndAlert(
    annotation,
    config,
    errorMessageForConfigValidation
  )
  if (!isValid) return

  const duplicatedAttributes = hasDuplicatedAttributes(annotation)
  if (duplicatedAttributes.size) {
    for (const [key, duplicatedAttribute] of duplicatedAttributes.entries()) {
      alertifyjs.error(
        `${key} has duplicate attributes ${duplicatedAttribute.map(
          (a) => `"${a}"`
        )}.`
      )
    }
    return
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

  setSpanAndTypeConfig(spanConfig, typeDefinition, patchedConfig)
  annotationData.reset(annotation)
}
