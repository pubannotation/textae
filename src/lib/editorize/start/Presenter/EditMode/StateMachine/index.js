import Machine from 'emitter-fsm'
import { MODE } from '../../../../../MODE'
import changeByShortcut from './changeByShortcut'
import pushTerm from './pushTerm'
import pushView from './pushView'
import toggleSimple from './toggleSimple'
import bindTransition from './bindTransition'
import Transition from './Transition'
import pushBlock from './pushBlock'

export default class StateMachine {
  constructor(
    editor,
    annotationData,
    noEdit,
    editEntity,
    editBlock,
    editRelation
  ) {
    const m = new Machine({
      states: [
        MODE.INIT,
        MODE.EDIT_DENOTATION_WITHOUT_RELATION,
        MODE.EDIT_DENOTATION_WITH_RELATION,
        MODE.EDIT_BLOCK_WITHOUT_RELATION,
        MODE.EDIT_BLOCK_WITH_RELATION,
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

    m.config(MODE.EDIT_BLOCK_WITHOUT_RELATION, {
      from: {
        exclude: [MODE.VIEW_WITH_RELATION]
      },
      to: {
        exclude: [MODE.INIT, MODE.VIEW_WITH_RELATION]
      }
    })

    m.config(MODE.EDIT_BLOCK_WITH_RELATION, {
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

    const transition = new Transition(
      editor,
      annotationData.typeGap,
      noEdit,
      editEntity,
      editBlock,
      editRelation
    )
    bindTransition(m, transition)

    this._m = m
    this._annotationData = annotationData
  }

  get currentState() {
    return this._m.currentState
  }

  setState(state) {
    this._m.setState(state)
  }

  toViewMode() {
    pushView(this)
  }

  toTermMode() {
    pushTerm(this, this._annotationData)
  }

  toBlockMode() {
    pushBlock(this, this._annotationData)
  }

  toRelationMode() {
    this.setState(MODE.EDIT_RELATION)
  }

  toggleSimpleMode() {
    toggleSimple(this)
  }

  changeModeByShortcut() {
    changeByShortcut(this)
  }
}
