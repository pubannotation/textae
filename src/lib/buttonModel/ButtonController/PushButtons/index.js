import Button from './Button'
import propagateStateOf from './propagateStateOf'
import updateModificationButton from './updateModificationButton'

const list = [
  'view',
  'term',
  'relation',
  'simple',
  'boundary-detection',
  'negation',
  'replicate-auto',
  'speculation'
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

  updateModificationButtons(selectionModel) {
    const modifications = selectionModel
      .all()
      .map((e) => this._annotationData.getModificationOf(e).map((m) => m.pred))

    updateModificationButton(this, 'Negation', modifications)
    updateModificationButton(this, 'Speculation', modifications)
  }
}
