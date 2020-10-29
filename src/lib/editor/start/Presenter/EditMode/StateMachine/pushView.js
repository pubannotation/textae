import { MODE } from '../../../../../MODE'

export default function(stateMachine) {
  switch (stateMachine.currentState) {
    case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
      break
    case MODE.EDIT_DENOTATION_WITH_RELATION:
    case MODE.EDIT_RELATION:
      stateMachine.setState(MODE.VIEW_WITH_RELATION)
      break
    default:
    // Do nothig.
  }
}
