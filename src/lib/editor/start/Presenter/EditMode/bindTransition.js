import StateMachine from './StateMachine'
import state from './state'

export default function(transition) {
  let stateMachine = new StateMachine()

  stateMachine
        .on('transition', (e) => {
          // For debug.
          // console.log(editor.editorId, 'from:', e.from, ' to:', e.to);
        })
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
