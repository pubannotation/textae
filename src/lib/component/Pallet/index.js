import Component from './Component'
import updateDisplay from './updateDisplay'
import enableJqueryDraggable from './enableJqueryDraggable'
import handleEventListners from './handleEventListners'
import moveIntoWindow from './moveIntoWindow'

export default class {
  constructor(editor, history, commander, autocompletionWs, elementEditor) {
    this._editor = editor
    this._history = history
    this._elementEditor = elementEditor
    this._el = new Component(editor, commander, autocompletionWs, elementEditor)

    // Bind event
    // Update save config button when history changing
    history.on('change', () => {
      if (this.visibly) {
        this._updateDisplay()
      }
    })
    this._editor.eventEmitter.on('textae.pallet.close', () => this.hide())

    // let the pallet draggable.
    enableJqueryDraggable(this._el, editor)
  }

  _updateDisplay() {
    updateDisplay(
      this._el,
      this._history,
      this._elementEditor.getHandler().typeContainer,
      this._elementEditor.getHandlerType()
    )
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
