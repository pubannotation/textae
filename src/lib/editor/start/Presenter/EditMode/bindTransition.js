import StateMachine from './StateMachine'
import state from './state'

export default function(transition) {
  const stateMachine = new StateMachine()

  stateMachine
    .on(toEnterEvent(state.TERM), () => transition.toTerm())
    .on(toEnterEvent(state.INSTANCE), () => transition.toInstance())
    .on(toEnterEvent(state.RELATION), () => transition.toRelation())
    .on(toEnterEvent(state.VIEW_TERM), () => transition.toViewTerm())
    .on(toEnterEvent(state.VIEW_INSTANCE), () => transition.toViewInstance())

  return stateMachine
}

function toEnterEvent(state) {
  return `enter:${state}`
}
