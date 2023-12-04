import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration'

export default function (
  originalData,
  controlViewModel,
  spanConfig,
  annotationModel,
  functionAvailability
) {
  setAnnotationAndConfiguration(
    originalData.defaultConfiguration,
    controlViewModel,
    spanConfig,
    annotationModel,
    originalData.defaultAnnotation,
    functionAvailability
  )
}
