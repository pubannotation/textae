import Machine from 'emitter-fsm'
import { MODE } from '../../../../../MODE'
import changeByShortcut from './changeByShortcut'
import pushTerm from './pushTerm'
import pushView from './pushView'
import toggleSimple from './toggleSimple'
import bindTransition from './bindTransition'
import Transition from './Transition'

export default class {
  constructor(editor, typeEditor, displayInstance) {
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

    const transition = new Transition(editor, typeEditor, displayInstance)
    bindTransition(m, transition)

    this._m = m
  }

  get currentState() {
    return this._m.currentState
  }

  setState(state) {
    this._m.setState(state)
  }

  pushView() {
    pushView(this)
  }

  pushTerm(annotationData) {
    pushTerm(this, annotationData)
  }

  toggleSimple() {
    toggleSimple(this)
  }

  changeByShortcut() {
    changeByShortcut(this)
  }
}
