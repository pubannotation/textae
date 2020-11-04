import { MODE } from '../../../../../MODE'

export default function (stateMachine) {
  switch (stateMachine.currentState) {
    case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
      break
    case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      stateMachine.setState(MODE.EDIT_BLOCK_WITH_RELATION)
      break
    case MODE.VIEW_WITHOUT_RELATION:
      stateMachine.setState(MODE.VIEW_WITH_RELATION)
      break
    case MODE.EDIT_DENOTATION_WITH_RELATION:
      stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
      break
    case MODE.EDIT_BLOCK_WITH_RELATION:
      stateMachine.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
      break
    case MODE.VIEW_WITH_RELATION:
      stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
      break
    default:
      throw new Error(`Invalid state: ${stateMachine.currentState}`)
  }
}
