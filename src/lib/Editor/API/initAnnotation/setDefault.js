import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration'

export default function (
  originalData,
  controlViewModel,
  spanConfig,
  annotationData,
  fetureToggles
) {
  setAnnotationAndConfiguration(
    originalData.defaultConfiguration,
    controlViewModel,
    spanConfig,
    annotationData,
    originalData.defaultAnnotation,
    fetureToggles
  )
}
