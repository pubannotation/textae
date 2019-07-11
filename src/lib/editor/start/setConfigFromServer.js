import * as ajaxAccessor from '../../util/ajaxAccessor'
import setSpanAndTypeConfig from './setSpanAndTypeConfig'

export default function(spanConfig, typeContainer, annotationData, config, annotation) {
  spanConfig.reset()

  if (typeof config === 'string') {
    ajaxAccessor.getAsync(
      config,
      configFromServer => {
        setSpanAndTypeConfig(spanConfig, typeContainer, configFromServer)
        annotationData.reset(annotation)
      },
      () => alert(`could not read the span configuration from the location you specified.: ${config}`)
    )
  } else {
    annotationData.reset(annotation)
  }
}
