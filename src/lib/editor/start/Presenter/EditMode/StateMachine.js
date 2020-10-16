import Machine from 'emitter-fsm'
import { MODE } from '../../../../MODE'

export default function() {
  const m = new Machine({
    states: [
      MODE.INIT,
      MODE.EDIT_DENOTATION_WITHOUT_RELATION,
      MODE.EDIT_DENOTATION_WITH_RELATION,
      MODE.EDIT_RELATION,
      MODE.VIEW_WITHOUT_RELATION,
      MODE.VIEW_WITH_RELATION
    ]
  })

  m.config(MODE.INIT, {
    to: {
      exclude: [MODE.EDIT_RELATION]
    }
  })

  m.config(MODE.EDIT_DENOTATION_WITHOUT_RELATION, {
    from: {
      exclude: [MODE.VIEW_WITH_RELATION]
    },
    to: {
      exclude: [MODE.INIT, MODE.VIEW_WITH_RELATION]
    }
  })

  m.config(MODE.EDIT_DENOTATION_WITH_RELATION, {
    from: {
      exclude: [MODE.VIEW_WITHOUT_RELATION]
    },
    to: {
      exclude: [MODE.INIT, MODE.VIEW_WITHOUT_RELATION]
    }
  })

  m.config(MODE.EDIT_RELATION, {
    from: {
      exclude: [MODE.INIT]
    },
    to: {
      exclude: [MODE.INIT, MODE.VIEW_WITHOUT_RELATION]
    }
  })

  m.config(MODE.VIEW_WITHOUT_RELATION, {
    from: {
      exclude: [MODE.EDIT_DENOTATION_WITH_RELATION, MODE.EDIT_RELATION]
    },
    to: {
      exclude: [MODE.INIT, MODE.EDIT_DENOTATION_WITH_RELATION]
    }
  })

  m.config(MODE.VIEW_WITH_RELATION, {
    from: {
      exclude: [MODE.EDIT_DENOTATION_WITHOUT_RELATION]
    },
    to: {
      exclude: [MODE.INIT, MODE.EDIT_DENOTATION_WITHOUT_RELATION]
    }
  })

  return m
}
