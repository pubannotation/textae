import { EventEmitter } from 'events'
import updateDisplay from './updateDisplay'
import enableJqueryDraggable from './enableJqueryDraggable'
import moveIntoWindow from './moveIntoWindow'
import createPalletElement from './createPalletElement'
import bindUserEvents from './bindUserEvents'

export default class extends EventEmitter {
  constructor(
    editor,
    originalData,
    typeDefinition,
    editModeName,
    typeContainer
  ) {
    super()
    this._el = createPalletElement(editModeName)
    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._editModeName = editModeName
    this._typeContainer = typeContainer

    // Bind user events to the event emitter.
    bindUserEvents(this)

    // let the pallet draggable.
    enableJqueryDraggable(this._el, editor)

    this.hide()
  }

  updateDisplay() {
    if (this.visibly) {
      updateDisplay(
        this._el,
        this._typeContainer,
        this._editModeName,
        this._originalData,
        this._typeDefinition
      )
    }
  }

  get el() {
    return this._el
  }

  // Display Entity or Relation Type on the palette according to the edit mode.
  show(point) {
    console.assert(point, 'point is necessary.')

    this._el.style.display = 'block'
    updateDisplay(
      this._el,
      this._typeContainer,
      this._editModeName,
      this._originalData,
      this._typeDefinition
    )
    moveIntoWindow(this._el, point)
  }

  hide() {
    this._el.style.display = 'none'
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
