/**
 *
 * @param {import('./ControlViewModel').default} controlViewModel
 * @param {import('../AnnotationModel').AnnotationModel} annotationModel
 */
export default function (
  validConfig,
  controlViewModel,
  spanConfig,
  annotationModel,
  annotation,
  functionAvailability
) {
  controlViewModel.setPushBUttons(validConfig)
  spanConfig.set(validConfig)
  annotationModel.reset(annotation, validConfig)
  functionAvailability.availability = validConfig['function availability']
}
