import idFactory from '../../../../../../idFactory'
import $ from 'jquery'

// A Type element has an entity_pane elment that has a label and will have entities.
export default function(namespace, typeContainer, spanId, type) {
  const typeId = idFactory.makeTypeId(spanId, type)

  // The EntityPane will have entities.
  const $entityPane = $('<div>')
    .attr('id', 'P-' + typeId)
    .addClass('textae-editor__entity-pane')

  // The label over the span.
  const $typeLabel = $('<div>')
    .addClass('textae-editor__type-label')
    .attr({tabindex: 0})

  const addButtonElement = document.createElement('div')
  addButtonElement.classList.add('textae-editor__attribute-button')
  addButtonElement.classList.add('textae-editor__attribute-button--add')
  addButtonElement.setAttribute('title', 'Add a new attribute to this entity.')

  return $('<div>')
    .attr('id', typeId)
    .addClass('textae-editor__type')
    .append($entityPane)
    .append($typeLabel)
    .append($(addButtonElement))
}
