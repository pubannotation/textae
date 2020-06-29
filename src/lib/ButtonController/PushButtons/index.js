import buttonConfig from '../../buttonConfig'
import Button from './Button'
import setMode from './setMode'

export default class {
  constructor(editor) {
    this._buttonMap = buttonConfig.pushButtons.reduce((map, buttonName) => {
      map.set(buttonName, new Button(editor, buttonName))
      return map
    }, new Map())

    // Bind an event.
    editor.eventEmitter.on('textae.editMode.transition', (mode, editable) =>
      setMode(this, mode, editable)
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
}
