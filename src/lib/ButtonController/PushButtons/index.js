import Button from './Button'
import propagateStateOf from './propagateStateOf'

const list = [
  'view',
  'term',
  'relation',
  'simple',
  'boundary-detection',
  'replicate-auto'
]

export default class {
  constructor(editor, annotationData) {
    this._editor = editor
    this._buttonMap = list.reduce((map, buttonName) => {
      map.set(buttonName, new Button(editor, buttonName))
      return map
    }, new Map())

    this._annotationData = annotationData

    // default pushed;
    this._buttonMap.get('boundary-detection').value(true)
  }

  propagate() {
    propagateStateOf(this._editor.eventEmitter, this._buttonMap)
  }

  getButton(name) {
    return this._buttonMap.get(name)
  }
}
