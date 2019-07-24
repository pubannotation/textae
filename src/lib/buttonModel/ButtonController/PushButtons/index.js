import { EventEmitter } from 'events'
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

export default class extends EventEmitter {
  constructor(annotationData) {
    super()
    this.buttonMap = list.reduce((map, buttonName) => {
      map.set(buttonName, new Button(buttonName))
      return map
    }, new Map())

    this.annotationData = annotationData

    // default pushed;
    this.buttonMap.get('boundary-detection').value(true)

    // Bind events.
    for (const button of this.buttonMap.values()) {
      button.on('change', (data) => super.emit('change', data))
    }
  }

  propagate() {
    propagateStateOf(this, this.buttonMap)
  }

  getButton(name) {
    return this.buttonMap.get(name)
  }

  updateModificationButtons(selectionModel) {
    const modifications = selectionModel
      .all()
      .map((e) => this.annotationData.getModificationOf(e).map((m) => m.pred))

    updateModificationButton(this, 'Negation', modifications)
    updateModificationButton(this, 'Speculation', modifications)
  }
}
