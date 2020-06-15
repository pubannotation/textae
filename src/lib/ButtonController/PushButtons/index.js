import buttonConfig from '../../buttonConfig'
import isView from '../isView'
import isRelation from '../isRelation'
import Button from './Button'
import propagateStateOf from './propagateStateOf'
import isTerm from './isTerm'
import isSimple from './isSimple'

export default class {
  constructor(editor) {
    this._editor = editor
    this._buttonMap = buttonConfig.pushButtons.reduce((map, buttonName) => {
      map.set(buttonName, new Button(editor, buttonName))
      return map
    }, new Map())

    // default pushed;
    this._buttonMap.get('boundary-detection').value(true)
  }

  propagate() {
    propagateStateOf(this._editor.eventEmitter, this._buttonMap)
  }

  getButton(name) {
    return this._buttonMap.get(name)
  }

  setForMode(mode, editable) {
    this.getButton('view').value(isView(editable))
    this.getButton('term').value(isTerm(editable, mode))
    this.getButton('relation').value(isRelation(mode))
    this.getButton('simple').value(isSimple(mode))
  }
}
