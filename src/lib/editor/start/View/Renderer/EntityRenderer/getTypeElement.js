import idFactory from '../../../../idFactory'
import getTypeDom from '../getTypeDom'
import setLabelToTypeLabel from './setLabelToTypeLabel'
import $ from 'jquery'

// render type unless exists.
export default function(namespace, typeContainer, gridRenderer, spanId, type) {
  let $type = getTypeDom(spanId, type)
  if ($type.length === 0) {
    $type = createEmptyTypeDomElement(namespace, typeContainer, spanId, type)
    getGrid(gridRenderer, spanId).appendChild($type[0])
  }

  return $type[0]
}

// A Type element has an entity_pane elment that has a label and will have entities.
function createEmptyTypeDomElement(namespace, typeContainer, spanId, type) {
  let typeId = idFactory.makeTypeId(spanId, type)

  // The EntityPane will have entities.
  let $entityPane = $('<div>')
    .attr('id', 'P-' + typeId)
    .addClass('textae-editor__entity-pane')

  // The label over the span.
  let $typeLabel = $('<div>')
    .addClass('textae-editor__type-label')
    .css({
      'background-color': typeContainer.getColor(type),
    })

  let addButtonElement = document.createElement('div')
  addButtonElement.classList.add('textae-editor__attribute-button')
  addButtonElement.classList.add('textae-editor__attribute-button--add')
  addButtonElement.setAttribute('title', 'Add a new attribute to this entity.')

  $typeLabel[0].setAttribute('tabindex', 0)

  setLabelToTypeLabel($typeLabel[0], namespace, typeContainer, type)

  return $('<div>')
    .attr('id', typeId)
    .addClass('textae-editor__type')
    .append($entityPane)
    .append($typeLabel)
    .append($(addButtonElement))
}

// Create a grid unless it exists.
function getGrid(gridRenderer, spanId) {
  let grid = document.querySelector(`#G${spanId}`)

  return grid || gridRenderer.render(spanId)
}
