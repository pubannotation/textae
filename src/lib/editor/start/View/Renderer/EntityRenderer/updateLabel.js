import getTypeDom from '../getTypeDom'
import setLabelToTypeLabel from './setLabelToTypeLabel'

export default function(annotationData, typeContainer, type) {
  annotationData
    .entity
    .all()
    .filter(entity => entity.type === type)
    .map(entity => getTypeDom(entity.span, type))
    .map(dom => dom.find('.textae-editor__type-label'))
    .filter(dom => dom[0])
    .forEach(label => {
      setLabelToTypeLabel(label[0], annotationData.namespace, typeContainer, type)
      setTypeColor(label[0], typeContainer, type)
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
