import Buttons from '../Buttons'
import { MODE } from '../../../../MODE'
import PushButton from './PushButton'

export default class PushButtons {
  constructor(eventEmitter) {
    this._buttons = new Buttons().pushButtons.reduce((map, name) => {
      map.set(name, new PushButton(name, eventEmitter))
      return map
    }, new Map())

    // Bind an event.
    eventEmitter.on('textae-event.edit-mode.transition', (mode) =>
      this._setMode(mode)
    )

    // default pushed;
    this._buttons.get('boundary detection').pushued = true
  }

  get(name) {
    return this._buttons.has(name)
      ? this._buttons.get(name)
      : new PushButton(name)
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
    this._buttons.get('view mode').isPushed = view
    this._buttons.get('term edit mode').isPushed = term
    this._buttons.get('block edit mode').isPushed = block
    this._buttons.get('relation edit mode').isPushed = relation
    this._buttons.get('simple view').isPushed = simple
  }
}
