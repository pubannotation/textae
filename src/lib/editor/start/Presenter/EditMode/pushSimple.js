import { state } from './state'

export default function(stateMachine) {
  switch (stateMachine.currentState) {
    case state.INSTANCE:
      stateMachine.setState(state.TERM)
      break
    case state.VIEW_INSTANCE:
      stateMachine.setState(state.VIEW_TERM)
      break
    default:
      throw new Error(`Invalid state: ${stateMachine.currentState}`)
  }
}
