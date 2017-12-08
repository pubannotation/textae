import Component from './Component'
import updateDisplay from './updateDisplay'

export default class {
  constructor(editor, history, annotationData, command, typeContainer, autocompletionWs, elementEditor) {
    this.editor = editor
    this.history = history
    this.el = new Component(editor, annotationData, command, typeContainer, autocompletionWs, elementEditor)

    // selfUpdate will be called in an event, so need to bind 'this'.
    let selfUpdate = this.selfUpdate.bind(this)
    this.editor.eventEmitter.on('textae.pallet.update', selfUpdate)
  }

  show(typeContainer, point) {
    this.typeContainer = typeContainer
    if (!typeContainer.isLock()) {
      setNotDefinedTypesToConfig(typeContainer)
    }
    updateDisplay(this.el, this.history, typeContainer, point)
  }

  hide() {
    this.el.style.display = 'none'
  }

  visibly() {
    return this.el.style.display !== 'none'
  }

  selfUpdate() {
    if (typeof this.typeContainer !== 'undefined' && !this.typeContainer.isLock()) {
      setNotDefinedTypesToConfig(this.typeContainer)
    }

    if (this.el.style.display !== 'none') {
      updateDisplay(this.el, this.history, this.typeContainer, null)
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
