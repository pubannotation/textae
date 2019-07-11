import setConfigFromServer from './setConfigFromServer'
import setConfigInAnnotation from './setConfigInAnnotation'

export default function(spanConfig, typeContainer, annotationData, annotation, config) {
  const ret = setConfigInAnnotation(spanConfig, typeContainer, annotation)

  if (ret === 'no config') {
    setConfigFromServer(spanConfig, typeContainer, annotationData, config, annotation)
  } else {
    annotationData.reset(annotation)
  }
}
