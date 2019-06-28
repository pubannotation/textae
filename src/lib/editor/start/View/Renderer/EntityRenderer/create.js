import idFactory from '../../../../idFactory'
import getTypeElement from './getTypeElement'
import arrangePositionOfPane from './arrangePositionOfPane'
import createEntityElement from './createEntityElement'
import appendAttribute from '../AttributeRenderer/appendAttribute'

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
export default function(editor, namspace, typeContainer, gridRenderer, modification, entity) {
  // Replace null to 'null' if type is null and undefined too.
  entity.type = String(entity.type)

  // Append a new entity to the type
  const pane = getTypeElement(
      namspace,
      typeContainer,
      gridRenderer,
      entity.span,
      entity.type
    )
    .querySelector('.textae-editor__entity-pane')

    const entityDomId = idFactory.makeEntityDomId(editor, entity.id)

  if (!pane.querySelector(`#${entityDomId}`)) {
    pane.appendChild(createEntityElement(editor, typeContainer, modification, entity))
    arrangePositionOfPane(pane)
  }

  for (const attribute of entity.attributes) {
    appendAttribute(editor, pane, attribute)
  }
}


