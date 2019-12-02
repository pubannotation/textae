import { EventEmitter } from 'events'
import updateDisplay from './updateDisplay'
import enableJqueryDraggable from './enableJqueryDraggable'
import moveIntoWindow from './moveIntoWindow'
import createPalletElement from './createPalletElement'
import bindUserEvents from './bindUserEvents'
import updateCssClassForEditMode from './updateCssClassForEditMode'
import show from './show'
import hide from './hide'

export default class extends EventEmitter {
  constructor(editor, originalData, typeDefinition) {
    super()
    this._el = createPalletElement()
    this._originalData = originalData
    this._typeDefinition = typeDefinition

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
  show(point, typeContainer, editModeName) {
    console.assert(point, 'point is necessary.')

    // The typeContainer is null when read-only mode
    if (typeContainer) {
      show(this, typeContainer, editModeName)
      updateDisplay(
        this._el,
        typeContainer,
        editModeName,
        this._originalData,
        this._typeDefinition
      )
      updateCssClassForEditMode(this._el, editModeName)
      moveIntoWindow(this._el, point)
    }
  }

  hide() {
    hide(this)
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
