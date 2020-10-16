import { state } from '../../../..//state'

export default function(stateMachine) {
  switch (stateMachine.currentState) {
    case state.EDIT_DENOTATION_WITHOUT_RELATION:
      stateMachine.setState(state.VIEW_WITHOUT_RELATION)
      break
    case state.EDIT_DENOTATION_WITH_RELATION:
    case state.EDIT_RELATION:
      stateMachine.setState(state.VIEW_WITH_RELATION)
      break
    default:
    // Do nothig.
  }
}
