import StateMachine from './StateMachine'
import { state } from './state'

export default function(transition) {
  const stateMachine = new StateMachine()

  stateMachine
    .on(toEnterEvent(state.EDIT_DENOTATION_WITHOUT_RELATION), () =>
      transition.toTerm()
    )
    .on(toEnterEvent(state.EDIT_DENOTATION_WITH_RELATION), () =>
      transition.toInstance()
    )
    .on(toEnterEvent(state.EDIT_RELATION), () => transition.toRelation())
    .on(toEnterEvent(state.VIEW_WITHOUT_RELATION), () =>
      transition.toViewTerm()
    )
    .on(toEnterEvent(state.VIEW_WITH_RELATION), () =>
      transition.toViewInstance()
    )

  return stateMachine
}

function toEnterEvent(state) {
  return `enter:${state}`
}
