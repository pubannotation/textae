import alertifyjs from 'alertifyjs'
import setSpanAndTypeConfig from '../../setSpanAndTypeConfig'
import patchConfiguration from '../../patchConfiguration'
import validateConfiguration from '../../validateConfiguration'
import hasUndefinedAttributes from '../../hasUndefinedAttributes'
import areNotBeginAndEndInteger from './areNotBeginAndEndInteger'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  config,
  errorMessageForConfigValidation
) {
  const patchedConfig = patchConfiguration(annotation, config)
  if (patchedConfig && !validateConfiguration(patchedConfig)) {
    alertifyjs.error(errorMessageForConfigValidation)
    return
  }

  const error = hasUndefinedAttributes(annotation, patchedConfig)
  if (error) {
    alertifyjs.error(error)
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
