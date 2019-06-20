import {
  EventEmitter as EventEmitter
}
from 'events'
import GridLayout from './GridLayout'
import updateGridLayout from './updateGridLayout'

export default class extends EventEmitter {
  constructor(editor, annotationData, typeContainer) {
    super()
    this.editor = editor
    this.gridLayout = new GridLayout(editor, annotationData, typeContainer)
  }

  update(typeGap) {
    updateGridLayout(this, this.editor, this.gridLayout, typeGap)
  }
}
