import Component from './Component'
import updateDisplay from './updateDisplay'
import {
  EventEmitter as EventEmitter
} from 'events'

export default class {
  constructor(editor, selectType, selectDefaultType, annotationData, changeColorFunc, selectAllFunc, removeTypeFunc, createTypeFunc) {
    this.editor = editor
    this.el = new Component(selectType, selectDefaultType, selectAllFunc, removeTypeFunc)
    this.annotationData = annotationData
    this.changeColorFunc = changeColorFunc
    this.createTypeFunc = createTypeFunc
  }

  show(typeContainer, point) {
    let labelUsedNumberMap = countLabelUsed(this.annotationData, typeContainer.getSortedIds()),
      selfUpdate = () => {
        let labelUsedNumberMap = countLabelUsed(this.annotationData, this.typeContainer.getSortedIds())

        updateDisplay(this.el, this.typeContainer, null, labelUsedNumberMap)
        bindChangeEvent(this.el, this.changeColorFunc, this.createTypeFunc)
        console.log('pallet updated.')
      }

    // selfUpdate will be called in an event, so neet to bind 'this'.
    selfUpdate = selfUpdate.bind(this)
    this.editor.eventEmitter.on('textae.pallet.update', selfUpdate)

    this.typeContainer = typeContainer
    updateDisplay(this.el, typeContainer, point, labelUsedNumberMap)
    bindChangeEvent(this.el, this.changeColorFunc, this.createTypeFunc)
  }

  hide() {
    this.el.style.display = 'none'
  }
}

function countLabelUsed(annotationData, sortedIds) {
  let instances = annotationData.entity.all().concat(annotationData.relation.all()),
    countMap = new Map()

  instances.forEach((instance) => {
    let type = instance.type
    if (sortedIds.indexOf(type) >= 0) {
      if (countMap.has(type)) {
        countMap.set(type, countMap.get(type) + 1)
      } else {
        countMap.set(type, 1)
      }
    }
  })

  return countMap
}

function bindChangeEvent(pallet, changeColorFunc, createTypeFunc) {
  let inputColors = pallet.getElementsByClassName('textae-editor__type-pallet__color-picker'),
    inputAdd = pallet.getElementsByClassName('textae-editor__type-pallet__entity-type__add')

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

  inputAdd[0].addEventListener('click', (e) => {
    createTypeFunc()
  })
}
