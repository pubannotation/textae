import buttonConfig from '../../buttonConfig'
import { MODE } from '../../MODE'
import Button from './Button'

export default class {
  constructor(editor) {
    this._buttonMap = buttonConfig.pushButtons.reduce((map, buttonName) => {
      map.set(buttonName, new Button(editor, buttonName))
      return map
    }, new Map())

    // Bind an event.
    editor.eventEmitter.on('textae.editMode.transition', (mode) =>
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
        this.getButton('view').value(true)
        this.getButton('term').value(false)
        this.getButton('relation').value(false)
        this.getButton('simple').value(true)
        break
      case MODE.VIEW_WITH_RELATION:
        this.getButton('view').value(true)
        this.getButton('term').value(false)
        this.getButton('relation').value(false)
        this.getButton('simple').value(false)
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.getButton('view').value(false)
        this.getButton('term').value(true)
        this.getButton('relation').value(false)
        this.getButton('simple').value(true)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.getButton('view').value(false)
        this.getButton('term').value(true)
        this.getButton('relation').value(false)
        this.getButton('simple').value(false)
        break
      case MODE.EDIT_RELATION:
        this.getButton('view').value(false)
        this.getButton('term').value(false)
        this.getButton('relation').value(true)
        this.getButton('simple').value(false)
        break
      default:
        throw `unknown edit mode!${mode}`
    }
  }
}
