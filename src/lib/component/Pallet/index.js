import Component from './Component'
import updateDisplay from './updateDisplay'
import $ from "jquery"

export default class {
  constructor(editor, history, command, autocompletionWs, elementEditor) {
    this.editor = editor
    this.history = history
    this.elementEditor = elementEditor
    this.el = new Component(editor, command, autocompletionWs, elementEditor)

    // selfUpdate will be called in an event, so need to bind 'this'.
    let selfUpdate = this.selfUpdate.bind(this),
      hide = this.hide.bind(this)
    this.editor.eventEmitter.on('textae.pallet.update', selfUpdate)
    this.editor.eventEmitter.on('textae.pallet.close', hide)

    // let the pallet draggable.
    $(this.el).draggable({
      containment: editor,
    })
  }

  show(point) {
    const typeContainer = this.elementEditor.getHandlerForPallet().typeContainer
    if (!typeContainer.isLock()) {
      setNotDefinedTypesToConfig(typeContainer)
    }
    updateDisplay(this.el, this.history, typeContainer, point, this.elementEditor.getHandlerType())
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

function setNotDefinedTypesToConfig(typeContainer) {
  let allIds = typeContainer.getSortedIds(),
    definedIds = typeContainer.getDefinedTypes().map((definedType) => {
      return definedType.id
    }),
    notDefinedIds = allIds.filter((someId) => {
      return definedIds.indexOf(someId) < 0
    })

  notDefinedIds.map((notDefinedId) => {
    typeContainer.setDefinedType({id: notDefinedId})
  })
}
