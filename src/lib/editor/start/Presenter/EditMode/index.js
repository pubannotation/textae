import { EventEmitter } from 'events'
import Transition from './Transition'
import bindTransition from './bindTransition'
import event from './event'
import Trigger from './Trigger'
import enableButtonHasAnnotation from './enableButtonHasAnnotation'

export default function(
  editor,
  annotationData,
  selectionModel,
  typeEditor,
  buttonStateHelper
) {
  const emitter = new EventEmitter()
  const transition = new Transition(
    editor,
    annotationData,
    selectionModel,
    typeEditor,
    buttonStateHelper
  )
  const stateMachine = bindTransition(transition)
  const trigger = new Trigger(stateMachine, annotationData)

  stateMachine.once('transition', () =>
    enableButtonHasAnnotation(buttonStateHelper)
  )

  transition
    .on(event.SHOW, () => emitter.emit(event.SHOW))
    .on(event.HIDE, () => emitter.emit(event.HIDE))
    .on(event.CHANGE, typeEditor.cancelSelect)
    .on(event.CHANGE, (editable, mode) =>
      emitter.emit(event.CHANGE, editable, mode)
    )

  Object.assign(emitter, trigger)

  return emitter
}
