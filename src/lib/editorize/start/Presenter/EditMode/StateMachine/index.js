import Machine from 'emitter-fsm'
import { MODE } from '../../../../../MODE'
import bindTransition from './bindTransition'

export default class StateMachine {
  /**
   *
   * @param {import('../../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('../Transition').default} transition
   */
  constructor(relationContainer, transition) {
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
        exclude: [MODE.INIT]
      }
    })

    m.config(MODE.VIEW_WITHOUT_RELATION, {
      from: {
        exclude: [MODE.EDIT_DENOTATION_WITH_RELATION]
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

    bindTransition(m, transition)

    this._m = m
    this._relationContainer = relationContainer
  }

  get currentState() {
    return this._m.currentState
  }

  setState(state) {
    this._m.setState(state)
  }

  toViewMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.VIEW_WITH_RELATION)
        } else {
          this.setState(MODE.VIEW_WITHOUT_RELATION)
        }
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this.setState(MODE.VIEW_WITHOUT_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.VIEW_WITH_RELATION)
        break
      default:
      // Do nothig.
    }
  }

  toTermMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
        } else {
          this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
        }
        break
      case MODE.VIEW_WITH_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
        break
      case MODE.VIEW_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
        break
      default:
      // Do nothig.
    }
  }

  toBlockMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.EDIT_BLOCK_WITH_RELATION)
        } else {
          this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
        }
        break
      case MODE.VIEW_WITH_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITH_RELATION)
        break
      case MODE.VIEW_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
        break
      default:
      // Do nothig.
    }
  }

  toRelationMode() {
    this.setState(MODE.EDIT_RELATION)
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITH_RELATION)
        break
      case MODE.VIEW_WITHOUT_RELATION:
        this.setState(MODE.VIEW_WITH_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
        break
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
        break
      case MODE.VIEW_WITH_RELATION:
        this.setState(MODE.VIEW_WITHOUT_RELATION)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    switch (this.currentState) {
      case MODE.VIEW_WITH_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
        break
      case MODE.VIEW_WITHOUT_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITH_RELATION)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.EDIT_RELATION)
        break
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.VIEW_WITH_RELATION)
        } else {
          this.setState(MODE.VIEW_WITHOUT_RELATION)
        }
        break
      default:
      // Do nothig.
    }
  }
}
