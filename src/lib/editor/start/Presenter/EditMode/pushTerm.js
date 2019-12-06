import state from './state'
import toEditStateAccordingToAnntationData from './toEditStateAccordingToAnntationData'

export default function(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case state.RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData)
      break
    case state.VIEW_INSTANCE:
      stateMachine.setState(state.INSTANCE)
      break
    case state.VIEW_TERM:
      stateMachine.setState(state.TERM)
      break
    default:
    // Do nothig.
  }
}
