import state from './state'

export default function(stateMachine) {
  switch (stateMachine.currentState) {
    case state.TERM:
      stateMachine.setState(state.VIEW_TERM)
      break
    case state.INSTANCE:
    case state.RELATION:
      stateMachine.setState(state.VIEW_INSTANCE)
      break
    default:
    // Do nothig.
  }
}
