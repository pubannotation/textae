import getEntityDom from '../../../getEntityDom'
import getTypeDom from '../getTypeDom'
import arrangePositionOfPane from './arrangePositionOfPane'

export default function(editor, annotationData, entity) {
  // Get old type from Dom, Because the entity may have new type when changing type of the entity.
  var oldType = $(getEntityDom(editor[0], entity.id)).remove().attr('type')

  // Delete type if no entity.
  if (doesTypeHasNoEntity(annotationData, entity, oldType)) {
    getTypeDom(entity.span, oldType).remove()
  } else {
    // Arrage the position of TypePane, because number of entities decrease.
    arrangePositionOfPane(getTypeDom(entity.span, oldType).find('.textae-editor__entity-pane')[0])
  }
}

function doesTypeHasNoEntity(annotationData, entity, typeName) {
  return annotationData.span.get(entity.span).getTypes().filter(function(type) {
    return type.name === typeName
  }).length === 0
}
