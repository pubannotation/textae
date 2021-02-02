import buttonConfig from '../../buttonConfig'
import { MODE } from '../../MODE'
import Button from './Button'

export default class PushButtons {
  constructor(editor) {
    this._buttonMap = buttonConfig.pushButtons.reduce((map, buttonName) => {
      map.set(buttonName, new Button(editor, buttonName))
      return map
    }, new Map())

    // Bind an event.
    editor.eventEmitter.on('textae-event.editMode.transition', (mode) =>
      this._setMode(mode)
    )

    // default pushed;
    this._buttonMap.get('boundary-detection').value(true)
  }

  propagate() {
    for (const button of this._buttonMap.values()) {
      button.propagate()
    }
  }

  getButton(name) {
    return this._buttonMap.get(name)
  }

  get names() {
    return this._buttonMap.keys()
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
    this._buttonMap.get('view').value(view)
    this._buttonMap.get('term').value(term)
    this._buttonMap.get('block').value(block)
    this._buttonMap.get('relation').value(relation)
    this._buttonMap.get('simple').value(simple)
  }
}
