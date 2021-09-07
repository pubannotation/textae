import buttonConfig from '../../../buttonConfig'
import { MODE } from '../../../../MODE'
import Button from './Button'

export default class PushButtons {
  constructor(eventEmitter) {
    this._buttons = buttonConfig.pushButtons.reduce((map, buttonName) => {
      map.set(buttonName, new Button(eventEmitter, buttonName))
      return map
    }, new Map())

    // Bind an event.
    eventEmitter.on('textae-event.edit-mode.transition', (mode) =>
      this._setMode(mode)
    )

    // default pushed;
    this._buttons.get('boundary-detection').pushued = true
  }

  get(buttonName) {
    return this._buttons.has(buttonName) && this._buttons.get(buttonName).pushed
  }

  propagate() {
    for (const button of this._buttons.values()) {
      button.propagate()
    }
  }

  getButton(name) {
    return this._buttons.get(name)
  }

  get names() {
    return this._buttons.keys()
  }

  _setMode(mode) {
    switch (mode) {
      case MODE.VIEW_WITHOUT_RELATION:
        this._updateModeButtons(true, false, false, false, true)
        break
      case MODE.VIEW_WITH_RELATION:
        this._updateModeButtons(true, false, false, false, false)
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this._updateModeButtons(false, true, false, false, true)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._updateModeButtons(false, true, false, false, false)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this._updateModeButtons(false, false, true, false, true)
        break
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._updateModeButtons(false, false, true, false, false)
        break
      case MODE.EDIT_RELATION:
        this._updateModeButtons(false, false, false, true, false)
        break
      default:
        throw `unknown edit mode!${mode}`
    }
  }

  _updateModeButtons(view, term, block, relation, simple) {
    this._buttons.get('view').pushed = view
    this._buttons.get('term').pushed = term
    this._buttons.get('block').pushed = block
    this._buttons.get('relation').pushed = relation
    this._buttons.get('simple').pushed = simple
  }
}
