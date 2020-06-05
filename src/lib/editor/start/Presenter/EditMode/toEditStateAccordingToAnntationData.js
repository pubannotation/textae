import isSimple from '../isSimple'
import state from './state'

export default function(stateMachine, annotationData) {
  if (isSimple(annotationData)) {
    stateMachine.setState(state.VIEW_TERM)
  } else {
    stateMachine.setState(state.VIEW_INSTANCE)
  }
}
