import { state } from '../../../../state'
import toEditStateAccordingToAnntationData from './toEditStateAccordingToAnntationData'

export default function(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case state.EDIT_RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData)
      break
    case state.VIEW_WITH_RELATION:
      stateMachine.setState(state.EDIT_DENOTATION_WITH_RELATION)
      break
    case state.VIEW_WITHOUT_RELATION:
      stateMachine.setState(state.EDIT_DENOTATION_WITHOUT_RELATION)
      break
    default:
    // Do nothig.
  }
}
