import state from './state'

export default function(stateMachine) {
  switch (stateMachine.currentState) {
    case state.TERM:
      stateMachine.setState(state.INSTANCE)
      break
    case state.VIEW_TERM:
      stateMachine.setState(state.VIEW_INSTANCE)
      break
    default:
      throw new Error(`Invalid state: ${stateMachine.currentState}`)
  }
}
