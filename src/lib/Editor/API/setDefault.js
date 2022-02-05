import setAnnotationAndConfiguration from './setAnnotationAndConfiguration'

export default function (
  originalData,
  buttonController,
  spanConfig,
  annotationData
) {
  setAnnotationAndConfiguration(
    originalData.defaultConfiguration,
    buttonController,
    spanConfig,
    annotationData,
    originalData.defaultAnnotation
  )
}
