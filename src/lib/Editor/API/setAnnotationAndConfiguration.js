/**
 *
 * @param {import('../API/ControlViewModel').default} controlViewModel
 * @param {import('../AnnotationData').default} annotationData
 */
export default function (
  validConfig,
  controlViewModel,
  spanConfig,
  annotationData,
  annotation,
  functionAvailability
) {
  controlViewModel.setPushBUttons(validConfig)
  spanConfig.set(validConfig)
  annotationData.reset(annotation, validConfig)
  functionAvailability.availability = validConfig['function availability']
}
