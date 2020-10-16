import isSimple from '../isSimple'
import { state } from './state'

export default function(stateMachine, annotationData) {
  if (isSimple(annotationData)) {
    stateMachine.setState(state.EDIT_DENOTATION_WITHOUT_RELATION)
  } else {
    stateMachine.setState(state.EDIT_DENOTATION_WITH_RELATION)
  }
}
