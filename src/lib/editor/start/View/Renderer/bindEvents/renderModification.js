import capitalize from 'capitalize'

export default function(
  annotationData,
  modelType,
  modification,
  renderer,
  buttonStateHelper
) {
  var target = annotationData[modelType].get(modification.obj)

  if (target) {
    renderer.changeModification(target)
    buttonStateHelper['updateBy' + capitalize(modelType)]()
  }
}
