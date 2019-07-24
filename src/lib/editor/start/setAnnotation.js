import setConfigFromServer from './setConfigFromServer'
import setConfigInAnnotation from './setConfigInAnnotation'

export default function(
  spanConfig,
  typeDefinition,
  annotationData,
  annotation,
  config
) {
  const ret = setConfigInAnnotation(spanConfig, typeDefinition, annotation)

  if (ret === 'no config') {
    setConfigFromServer(
      spanConfig,
      typeDefinition,
      annotationData,
      config,
      annotation
    )
  } else {
    annotationData.reset(annotation)
  }
}
