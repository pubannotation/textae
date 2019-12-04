import Transition from './Transition'
import bindTransition from './bindTransition'
import Trigger from './Trigger'
import enableButtonHasAnnotation from './enableButtonHasAnnotation'

export default function(
  editor,
  annotationData,
  selectionModel,
  typeEditor,
  buttonStateHelper,
  displayInstance
) {
  const transition = new Transition(
    editor,
    annotationData,
    selectionModel,
    typeEditor,
    buttonStateHelper,
    displayInstance
  )
  const stateMachine = bindTransition(transition)
  const trigger = new Trigger(stateMachine, annotationData)

  stateMachine.once('transition', () =>
    enableButtonHasAnnotation(buttonStateHelper)
  )

  return trigger
}
