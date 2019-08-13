import Component from './Component'
import updateDisplay from './updateDisplay'
import enableJqueryDraggable from './enableJqueryDraggable'
import handleEventListners from './handleEventListners'
import moveIntoWindow from './moveIntoWindow'

export default class {
  constructor(editor, history, command, autocompletionWs, elementEditor) {
    this.editor = editor
    this.history = history
    this.elementEditor = elementEditor
    this.el = new Component(editor, command, autocompletionWs, elementEditor)

    // Bind event
    // Update save config button when history changing
    history.on('change', () => {
      if (this.visibly) {
        this._updateDisplay()
      }
    })
    this.editor.eventEmitter.on('textae.pallet.close', () => this.hide())

    // let the pallet draggable.
    enableJqueryDraggable(this.el, editor)
  }

  _updateDisplay() {
    updateDisplay(
      this.el,
      this.history,
      this.elementEditor.getHandler().typeContainer,
      this.elementEditor.getHandlerType()
    )
  }

  // Display Entity or Relation Type on the palette according to the edit mode.
  show(point) {
    console.assert(point, 'point is necessary.')

    const typeContainer = this.elementEditor.getHandler().typeContainer

    // The typeContainer is null when read-only mode
    if (typeContainer) {
      // Save the event listener as an object property to delete the event listener when the palette is closed.
      this.updateDisplayForEditMode = () => this._updateDisplay()

      // Update table content when config lock state or type definition changing
      handleEventListners(typeContainer, 'add', this.updateDisplayForEditMode)

      this._updateDisplay()
      moveIntoWindow(this.el, point)
    }
  }

  hide() {
    this.el.style.display = 'none'

    // Release event listeners that bound when opening pallet.
    if (this.updateDisplayForEditMode) {
      const t = this.elementEditor.getHandler().typeContainer
      handleEventListners(t, 'remove', this.updateDisplayForEditMode)
    }
  }

  get visibly() {
    return this.el.style.display !== 'none'
  }
}
