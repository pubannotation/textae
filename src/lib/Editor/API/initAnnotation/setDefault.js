import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration'

export default function (
  originalData,
  controlViewModel,
  spanConfig,
  annotationData,
  functionAvailability
) {
  setAnnotationAndConfiguration(
    originalData.defaultConfiguration,
    controlViewModel,
    spanConfig,
    annotationData,
    originalData.defaultAnnotation,
    functionAvailability
  )
}
