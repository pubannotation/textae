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

    // selfUpdate will be called in an event, so need to bind 'this'.
    const selfUpdate = this.selfUpdate.bind(this)
    const hide = this.hide.bind(this)

    this.editor.eventEmitter.on('textae.pallet.update', () => this.selfUpdate())
    this.editor.eventEmitter.on('textae.pallet.close', hide)

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

  selfUpdate() {
    const typeContainer = this.elementEditor.getHandlerForPallet().typeContainer
    if (typeof typeContainer !== 'undefined' && !typeContainer.isLock()) {
      setNotDefinedTypesToConfig(typeContainer)
    }

    if (this.el.style.display !== 'none') {
      updateDisplay(this.el, this.history, typeContainer, null, this.elementEditor.getHandlerType())
    }
  }
}


