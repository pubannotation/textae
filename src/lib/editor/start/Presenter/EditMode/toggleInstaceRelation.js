import state from './state'
import toEditStateAccordingToAnntationData from './toEditStateAccordingToAnntationData'

export default function(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case state.TERM:
    case state.INSTANCE:
      stateMachine.setState(state.RELATION)
      break
    case state.RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData)
      break
    default:
    // Do nothig.
  }
}
