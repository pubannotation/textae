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
    this.editor.eventEmitter.on('textae.pallet.update', () => {
      updateSelf(this.elementEditor.getHandlerForPallet().typeContainer, this.el, this.history, this.elementEditor.getHandlerType())
    })
    this.editor.eventEmitter.on('textae.pallet.close', () => this.hide())

    // let the pallet draggable.
    $(this.el).draggable({
      containment: editor,
    })
  }

  show(point) {
    const typeContainer = this.elementEditor.getHandlerForPallet().typeContainer

    // The typeContainer is null when read-only mode
    if (typeContainer) {
      const handlerType = this.elementEditor.getHandlerType()
      const el = this.el
      const history = this.history
      this.onConfigLockChange = () => updateDisplay(el, history, typeContainer, null, handlerType)

      typeContainer.on('type.lock', this.onConfigLockChange)
      updateDisplay(el, history, typeContainer, point, handlerType)
    }
  }

  hide() {
    this.el.style.display = 'none'

    if (this.onConfigLockChange) {
      this.elementEditor.getHandlerForPallet().typeContainer.removeListener('type.lock', this.onConfigLockChange)
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
