import Component from './Component'
import updateDisplay from './updateDisplay'

export default class {
  constructor(editor, selectType, selectDefaultType, annotationData, changeColorFunc, selectAllFunc, removeTypeFunc, createTypeFunc) {
    this.editor = editor
    this.el = new Component(editor, selectType, selectDefaultType, selectAllFunc, removeTypeFunc, createTypeFunc)
    this.annotationData = annotationData
    this.changeColorFunc = changeColorFunc
  }

  show(typeContainer, point) {
    let selfUpdate = () => {
        updateDisplay(this.el, this.typeContainer, null)
        bindChangeEvent(this.el, this.changeColorFunc)
      }

    // selfUpdate will be called in an event, so need to bind 'this'.
    selfUpdate = selfUpdate.bind(this)
    this.editor.eventEmitter.on('textae.pallet.update', selfUpdate)

    this.typeContainer = typeContainer
    if (!typeContainer.isLock()) {
      setNotDefinedTypesToConfig(typeContainer)
    }
    updateDisplay(this.el, typeContainer, point)
    bindChangeEvent(this.el, this.changeColorFunc)
  }

  hide() {
    this.el.style.display = 'none'
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

function bindChangeEvent(pallet, changeColorFunc) {
  let inputColors = pallet.getElementsByClassName('textae-editor__type-pallet__color-picker')

  Array.from(inputColors, (inputColor) => {
    inputColor.addEventListener('change', (e) => {
      let target = e.target,
        id = target.getAttribute('data-id'),
        newColor = target.value

      changeColorFunc(id, newColor)

      target.setAttribute('value', newColor)
      target.parentNode.parentNode.setAttribute('style', 'background-color:' + newColor + ';')
    })
  })
}
