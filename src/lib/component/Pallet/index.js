import Component from './Component'
import updateDisplay from './updateDisplay'

export default class {
  constructor(selectType, selectDefaultType, annotationData) {
    this.el = new Component(selectType, selectDefaultType)
    this.annotationData = annotationData
  }

  show(typeContainer, point) {
    let labelUsedNumberMap = countLabelUsed(this.annotationData, typeContainer.getSortedIds())
    updateDisplay(this.el, typeContainer, point, labelUsedNumberMap)
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
