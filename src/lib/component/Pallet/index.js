import Component from './Component'
import updateDisplay from './updateDisplay'

export default class {
  constructor(editor, selectType, selectDefaultType, annotationData, changeColorFunc, selectAllFunc, removeTypeFunc) {
    this.editor = editor
    this.el = new Component(selectType, selectDefaultType, selectAllFunc, removeTypeFunc)
    this.annotationData = annotationData
    this.changeColorFunc = changeColorFunc
  }

  show(typeContainer, point) {
    let labelUsedNumberMap = countLabelUsed(this.annotationData, typeContainer.getSortedIds())
    updateDisplay(this.el, typeContainer, point, labelUsedNumberMap)
    bindChangeEvent(this.editor, this.el, typeContainer, this.changeColorFunc, this.update)
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

function bindChangeEvent(editor, pallet, typeContainer, changeColorFunc, updateFunc) {
  let inputColors = pallet.getElementsByTagName('input')

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
