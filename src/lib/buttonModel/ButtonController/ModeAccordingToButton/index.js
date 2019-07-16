import {
  EventEmitter as EventEmitter
}
from 'events'
import reduce2hash from '../reduce2hash'
import Button from './Button'
import propagateStateOf from './propagateStateOf'
import updateModificationButton from './updateModificationButton'

const buttonList = [
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
    this.buttons = buttonList.map((name) => new Button(name))
    this.buttonHash = this.buttons.reduce(reduce2hash(), {})
    this.annotationData = annotationData

    // default pushed;
    this.buttonHash['boundary-detection'].value(true)

    // Bind events.
    this.buttons.forEach(function(button) {
      button.on('change', (data) => super.emit('change', data))
    })
  }

  propagate() {
    propagateStateOf(this, this.buttons)
  }

  getButton(name) {
    return this.buttonHash[name]
  }

  updateModificationButtons(selectionModel) {
    const modifications = selectionModel.all().map((e) => this.annotationData.getModificationOf(e).map((m) => m.pred))

    updateModificationButton(this, 'Negation', modifications)
    updateModificationButton(this, 'Speculation', modifications)
  }
}
