import { EventEmitter } from 'events'
import updateDisplay from './updateDisplay'
import enableJqueryDraggable from './enableJqueryDraggable'
import handleEventListners from './handleEventListners'
import moveIntoWindow from './moveIntoWindow'
import show from './show'
import createPalletElement from './createPalletElement'
import bindUserEvents from './bindUserEvents'

export default class extends EventEmitter {
  constructor(
    editor,
    history,
    elementEditor,
    originalData,
    typeDefinition,
    dataAccessObject
  ) {
    super()
    this._editor = editor
    this._elementEditor = elementEditor
    this._el = createPalletElement()
    this._originalData = originalData
    this._typeDefinition = typeDefinition

    // Bind user events to the event emitter.
    bindUserEvents(this)

    // Bind event
    // Update save config button when changing history and savigng configuration.
    history.on('change', () => this._updateDisplay())
    dataAccessObject.on('configuration.save', () => this._updateDisplay())
    this._editor.eventEmitter.on('textae.pallet.close', () => this.hide())

    // let the pallet draggable.
    enableJqueryDraggable(this._el, editor)
  }

  _updateDisplay() {
    if (this.visibly) {
      updateDisplay(
        this._el,
        this._elementEditor.getHandler().typeContainer,
        this._elementEditor.getHandlerType(),
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

    const typeContainer = this._elementEditor.getHandler().typeContainer

    // The typeContainer is null when read-only mode
    if (typeContainer) {
      // Save the event listener as an object property to delete the event listener when the palette is closed.
      this.updateDisplayForEditMode = () => this._updateDisplay()

      // Update table content when config lock state or type definition changing
      handleEventListners(typeContainer, 'add', this.updateDisplayForEditMode)

      show(this._el)
      this._updateDisplay()
      moveIntoWindow(this._el, point)
    }
  }

  hide() {
    this._el.style.display = 'none'

    // Release event listeners that bound when opening pallet.
    if (this.updateDisplayForEditMode) {
      const t = this._elementEditor.getHandler().typeContainer
      handleEventListners(t, 'remove', this.updateDisplayForEditMode)

      this.updateDisplayForEditMode = null
    }
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
