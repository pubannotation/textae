/**
 *
 * @param {import('../AnnotationData').default} annotationData
 */
export default function (
  validConfig,
  buttonController,
  spanConfig,
  annotationData,
  annotation
) {
  buttonController.setPushBUttons(validConfig)
  spanConfig.set(validConfig)
  annotationData.reset(annotation, validConfig)
}
