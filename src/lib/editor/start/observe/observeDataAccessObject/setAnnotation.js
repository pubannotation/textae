import setPushBUttons from '../../setPushBUttons'

export default function (
  validConfig,
  buttonController,
  spanConfig,
  annotationData,
  annotation
) {
  setPushBUttons(validConfig, buttonController)
  spanConfig.set(validConfig)
  annotationData.reset(annotation, validConfig)
}
