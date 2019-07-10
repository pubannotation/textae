import getTypeDom from '../getTypeDom'
import setLabelToTypeLabel from './setLabelToTypeLabel'

export default function(annotationData, typeContainer, type) {
  annotationData
    .entity
    .all()
    .filter(entity => entity.type === type)
    .map(entity => getTypeDom(entity.span, type))
    .filter(typeDom => typeDom)
    .map(typeDom => typeDom.querySelector('.textae-editor__type-label'))
    .filter(label => label)
    .forEach(label => {
      setLabelToTypeLabel(label, annotationData.namespace, typeContainer, type)
      setTypeColor(label, typeContainer, type)
    })
}

function setTypeColor(label, typeContainer, type) {
  let color = typeContainer.getColor(type),
    entities = label.nextElementSibling.getElementsByClassName('textae-editor__entity')

  label.setAttribute('style', 'background-color: ' + color)
  Array.prototype.forEach.call(entities, (entity) => {
    entity.setAttribute('style', 'border-color: ' + color)
  })
}
