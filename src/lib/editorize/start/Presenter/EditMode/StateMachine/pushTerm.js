import { MODE } from '../../../../../MODE'
import toEditStateAccordingToAnntationData from './toEditStateAccordingToAnntationData'

export default function (stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case MODE.EDIT_RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData)
      break
    case MODE.VIEW_WITH_RELATION:
    case MODE.EDIT_BLOCK_WITH_RELATION:
      stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
      break
    case MODE.VIEW_WITHOUT_RELATION:
    case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
      break
    default:
    // Do nothig.
  }
}
