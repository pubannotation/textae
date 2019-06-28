import Selector from '../../../Selector'
import createEntityUnlessBlock from './createEntityUnlessBlock'
import removeEntityElement from './removeEntityElement'
import removeNoEntityPaneElement from './removeNoEntityPaneElement'

export default function(editor, annotationData, selectionModel, typeContainer, gridRenderer, modification, entity) {
  const selector = new Selector(editor, annotationData)

  // Remove an old entity.
  const parentNode = removeEntityElement(editor, entity.id)

  // Remove old entity after add new one, because grids will be removed unless entities.
  // Show a new entity.
  createEntityUnlessBlock(
    editor,
    annotationData.namespace,
    typeContainer,
    gridRenderer,
    modification,
    entity
  )

  // Remove an parentNode unless entity.
  removeNoEntityPaneElement(parentNode)

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    selector.entity.select(entity.id)
    selector.entityLabel.update(entity.id)
  }
}
