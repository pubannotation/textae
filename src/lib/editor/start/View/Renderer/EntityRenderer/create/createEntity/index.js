import idFactory from '../../../../../../idFactory'
import getTypeElement from './getTypeElement'
import arrangePositionOfPane from '../../arrangePositionOfPane'
import createEntityElement from './createEntityElement'

// An entity is a circle on Type that is an endpoint of a relation.
// A span have one grid and a grid can have multi types and a type can have multi entities.
// A grid is only shown when at least one entity is owned by a correspond span.
export default function(
  editor,
  namspace,
  typeDefinition,
  gridRenderer,
  modification,
  entity
) {
  // Append a new entity to the type
  const typeDom = getTypeElement(namspace, typeDefinition, gridRenderer, entity)
  const pane = typeDom.querySelector('.textae-editor__entity-pane')
  const entityDomId = idFactory.makeEntityDomId(editor, entity.id)

  if (!pane.querySelector(`#${entityDomId}`)) {
    pane.appendChild(
      createEntityElement(editor, typeDefinition, modification, entity)
    )
    arrangePositionOfPane(pane)
  }
}
