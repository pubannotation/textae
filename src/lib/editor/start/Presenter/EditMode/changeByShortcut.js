import state from './state'

export default function(stateMachine) {
  switch (stateMachine.currentState) {
    case state.VIEW_INSTANCE:
      stateMachine.setState(state.INSTANCE)
      break
    case state.VIEW_TERM:
      stateMachine.setState(state.TERM)
      break
    case state.TERM:
    case state.INSTANCE:
      stateMachine.setState(state.RELATION)
      break
    case state.RELATION:
      stateMachine.setState(state.VIEW_INSTANCE)
      break
    default:
    // Do nothig.
  }
}
