import {
  EventEmitter
}
from 'events'
import Transition from './Transition'
import bindTransition from './bindTransition'
import event from './event'
import Trigger from './Trigger'
import enableButtonHasAnnotation from './enableButtonHasAnnotation'

export default function(editor, annotationData, selectionModel, typeEditor, buttonStateHelper) {
  let emitter = new EventEmitter(),
    transition = new Transition(editor, annotationData, selectionModel, typeEditor, buttonStateHelper),
    stateMachine = bindTransition(transition),
    trigger = new Trigger(stateMachine, annotationData)

  stateMachine.once('transition', () => enableButtonHasAnnotation(buttonStateHelper))

  transition
    .on(event.SHOW, () => emitter.emit(event.SHOW))
    .on(event.HIDE, () => emitter.emit(event.HIDE))
    .on(event.CHANGE, typeEditor.cancelSelect)
    .on(event.CHANGE, (editable, mode) => emitter.emit(event.CHANGE, editable, mode))

  Object.assign(emitter, trigger, {
    isView: () => stateMachine.currentState === 'View Term' || stateMachine.currentState === 'View Instance'
  })

  return emitter
}
