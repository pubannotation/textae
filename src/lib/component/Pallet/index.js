import Component from './Component'
import updateDisplay from './updateDisplay'
import $ from "jquery"

export default class {
  constructor(editor, history, command, autocompletionWs, elementEditor) {
    this.editor = editor
    this.history = history
    this.elementEditor = elementEditor
    this.el = new Component(editor, command, autocompletionWs, elementEditor)

    // Bind event
    // Update save config button when history changing
    history.on('change', () => {
      updateSelf(this.elementEditor.getHandler().typeContainer, this.el, this.history, this.elementEditor.getHandlerType())
    })
    this.editor.eventEmitter.on('textae.pallet.close', () => this.hide())

    // let the pallet draggable.
    $(this.el).draggable({
      containment: editor,
    })
  }

  show(point) {
    const typeContainer = this.elementEditor.getHandler().typeContainer

    // The typeContainer is null when read-only mode
    if (typeContainer) {
      const handlerType = this.elementEditor.getHandlerType()
      const el = this.el
      const history = this.history
      this.onConfigLockChange = () => updateDisplay(el, history, typeContainer, null, handlerType)

      // Update table content when config lock state or type definition changing
      typeContainer.on('type.lock', this.onConfigLockChange)
      typeContainer.on('type.change', this.onConfigLockChange)

      updateDisplay(el, history, typeContainer, point, handlerType)
    }
  }

  hide() {
    this.el.style.display = 'none'

    // Release event listeners that bound when opening pallet.
    if (this.onConfigLockChange) {
      const typeContainer = this.elementEditor.getHandler().typeContainer
      typeContainer.removeListener('type.lock', this.onConfigLockChange)
      typeContainer.removeListener('type.change', this.onConfigLockChange)
    }
  }

  visibly() {
    return this.el.style.display !== 'none'
  }
}

function updateSelf(typeContainer, el, history, handlerType) {
  if (el.style.display !== 'none') {
    updateDisplay(el, history, typeContainer, null, handlerType)
  }
}
