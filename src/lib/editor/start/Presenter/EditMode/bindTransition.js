import { MODE } from '../../../../MODE'

export default function(stateMachine, transition) {
  stateMachine
    .on(toEnterEvent(MODE.EDIT_DENOTATION_WITHOUT_RELATION), () =>
      transition.toEditDenotationWithoutRelation()
    )
    .on(toEnterEvent(MODE.EDIT_DENOTATION_WITH_RELATION), () =>
      transition.toEditDenotationWithRelation()
    )
    .on(toEnterEvent(MODE.EDIT_RELATION), () => transition.toEditRelation())
    .on(toEnterEvent(MODE.VIEW_WITHOUT_RELATION), () =>
      transition.toViewWithoutRelation()
    )
    .on(toEnterEvent(MODE.VIEW_WITH_RELATION), () =>
      transition.toViewWithRelation()
    )
}

function toEnterEvent(state) {
  return `enter:${state}`
}
