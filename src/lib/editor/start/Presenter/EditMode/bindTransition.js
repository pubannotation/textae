import StateMachine from './StateMachine'
import { state } from './state'

export default function(transition) {
  const stateMachine = new StateMachine()

  stateMachine
    .on(toEnterEvent(state.EDIT_DENOTATION_WITHOUT_RELATION), () =>
      transition.toEditDenotationWithoutRelation()
    )
    .on(toEnterEvent(state.EDIT_DENOTATION_WITH_RELATION), () =>
      transition.toEditDenotationWithRelation()
    )
    .on(toEnterEvent(state.EDIT_RELATION), () => transition.toEditRelation())
    .on(toEnterEvent(state.VIEW_WITHOUT_RELATION), () =>
      transition.toViewWithoutRelation()
    )
    .on(toEnterEvent(state.VIEW_WITH_RELATION), () =>
      transition.toViewWithRelation()
    )

  return stateMachine
}

function toEnterEvent(state) {
  return `enter:${state}`
}
