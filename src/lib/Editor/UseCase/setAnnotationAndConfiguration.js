/**
 *
 * @param {import('./MenuState').MenuState} menuState
 * @param {import('../AnnotationModel').AnnotationModel} annotationModel
 * @param {import('./FunctionAvailability').FunctionAvailability} functionAvailability
 */
export default function setAnnotationAndConfiguration(
  eventEmitter,
  validConfig,
  menuState,
  spanConfig,
  annotationModel,
  annotation,
  functionAvailability
) {
  menuState.setPushButtons(validConfig)
  spanConfig.set(validConfig)
  annotationModel.reset(annotation, validConfig)
  functionAvailability.availability = validConfig['function availability']

  eventEmitter.emit('textae-event.configuration.reset')
}
