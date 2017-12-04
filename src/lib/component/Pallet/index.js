import Component from './Component'
import updateDisplay from './updateDisplay'

export default class {
  constructor(editor, annotationData, command, typeContainer, autocompletionWs, elementEditor) {
    this.editor = editor
    this.el = new Component(editor, annotationData, command, typeContainer, autocompletionWs, elementEditor)
  }

  show(typeContainer, point) {
    let selfUpdate = () => {
      if (this.el.style.display !== 'none') {
        updateDisplay(this.el, this.typeContainer, null)
      }
    }

    // selfUpdate will be called in an event, so need to bind 'this'.
    selfUpdate = selfUpdate.bind(this)
    this.editor.eventEmitter.on('textae.pallet.update', selfUpdate)

    this.typeContainer = typeContainer
    if (!typeContainer.isLock()) {
      setNotDefinedTypesToConfig(typeContainer)
    }
    updateDisplay(this.el, typeContainer, point)
  }

  hide() {
    this.el.style.display = 'none'
  }

  visibly() {
    return this.el.style.display !== 'none'
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
