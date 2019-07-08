import Component from './Component'
import updateDisplay from './updateDisplay'
import $ from "jquery"
import show from './show'
import setNotDefinedTypesToConfig from './setNotDefinedTypesToConfig'

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
    const handlerType = this.elementEditor.getHandlerType()
    const el = this.el
    const history = this.history

    show(typeContainer, el, history, point, handlerType)
  }

  hide() {
    this.el.style.display = 'none'
  }

  visibly() {
    return this.el.style.display !== 'none'
  }
}

function updateSelf(typeContainer, el, history, handlerType) {
  if (typeof typeContainer !== 'undefined' && !typeContainer.isLock()) {
    setNotDefinedTypesToConfig(typeContainer)
  }

  if (el.style.display !== 'none') {
    updateDisplay(el, history, typeContainer, null, handlerType)
  }
}
