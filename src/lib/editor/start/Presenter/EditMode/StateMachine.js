import Machine from 'emitter-fsm'
import { state } from '../../../../state'

export default function() {
  const m = new Machine({
    states: [
      state.INIT,
      state.EDIT_DENOTATION_WITHOUT_RELATION,
      state.EDIT_DENOTATION_WITH_RELATION,
      state.EDIT_RELATION,
      state.VIEW_WITHOUT_RELATION,
      state.VIEW_WITH_RELATION
    ]
  })

  m.config(state.INIT, {
    to: {
      exclude: [state.EDIT_RELATION]
    }
  })

  m.config(state.EDIT_DENOTATION_WITHOUT_RELATION, {
    from: {
      exclude: [state.VIEW_WITH_RELATION]
    },
    to: {
      exclude: [state.INIT, state.VIEW_WITH_RELATION]
    }
  })

  m.config(state.EDIT_DENOTATION_WITH_RELATION, {
    from: {
      exclude: [state.VIEW_WITHOUT_RELATION]
    },
    to: {
      exclude: [state.INIT, state.VIEW_WITHOUT_RELATION]
    }
  })

  m.config(state.EDIT_RELATION, {
    from: {
      exclude: [state.INIT]
    },
    to: {
      exclude: [state.INIT, state.VIEW_WITHOUT_RELATION]
    }
  })

  m.config(state.VIEW_WITHOUT_RELATION, {
    from: {
      exclude: [state.EDIT_DENOTATION_WITH_RELATION, state.EDIT_RELATION]
    },
    to: {
      exclude: [state.INIT, state.EDIT_DENOTATION_WITH_RELATION]
    }
  })

  m.config(state.VIEW_WITH_RELATION, {
    from: {
      exclude: [state.EDIT_DENOTATION_WITHOUT_RELATION]
    },
    to: {
      exclude: [state.INIT, state.EDIT_DENOTATION_WITHOUT_RELATION]
    }
  })

  return m
}
