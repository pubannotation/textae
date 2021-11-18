import { MODE } from '../../../../../MODE'

export default function (stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      stateMachine.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
      break
    case MODE.EDIT_DENOTATION_WITH_RELATION:
      stateMachine.setState(MODE.EDIT_BLOCK_WITH_RELATION)
      break
    case MODE.EDIT_RELATION:
      if (annotationData.isSimple) {
        stateMachine.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
      } else {
        stateMachine.setState(MODE.EDIT_BLOCK_WITH_RELATION)
      }
      break
    case MODE.VIEW_WITH_RELATION:
      stateMachine.setState(MODE.EDIT_BLOCK_WITH_RELATION)
      break
    case MODE.VIEW_WITHOUT_RELATION:
      stateMachine.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
      break
    default:
    // Do nothig.
  }
}
