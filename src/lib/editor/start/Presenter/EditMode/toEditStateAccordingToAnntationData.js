import isSimple from '../isSimple'
import state from './state'

export default function(stateMachine, annotationData) {
  if (isSimple(annotationData)) {
    stateMachine.setState(state.TERM)
  } else {
    stateMachine.setState(state.INSTANCE)
  }
}
