import getTypeDom from '../getTypeDom'
import createAttributeElement from './createAttributeElement'

export default function(editor, namspace, typeContainer, gridRenderer, attributeModel, entityModels) {
  // Replace null to 'null' if type is null and undefined too.
  attributeModel.type = String(attributeModel.type)

  let entity = entityModels.filter((entity) => {
      return entity.id === attributeModel.subj
    })[0],
    $type = getTypeDom(entity.span, entity.type),
    $attribute = createAttributeElement(editor, typeContainer, attributeModel)
    $type.find('.textae-editor__type-label').append($attribute)

  return $attribute
}

// Create a grid unless it exists.
function getGrid(gridRenderer, spanId) {
  let grid = document.querySelector(`#G${spanId}`)

  return grid || gridRenderer.render(spanId)
}

