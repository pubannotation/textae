import Selector from '../../../Selector'
import create from './create'
import removeEntityElement from './removeEntityElement'
import updateAncestorsElement from './updateAncestorsElement'

export default function(
  editor,
  annotationData,
  selectionModel,
  typeContainer,
  gridRenderer,
  modification,
  entity
) {
  const selector = new Selector(editor, annotationData)

  // Remove an old entity.
  const paneElement = removeEntityElement(editor, entity.id)

  // Remove old entity after add new one, because grids will be removed unless entities.
  // Show a new entity.
  create(
    editor,
    typeContainer,
    gridRenderer,
    modification,
    entity,
    annotationData.namespace
  )

  // Remove an parentNode unless entity.
  updateAncestorsElement(paneElement)

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    selector.entity.select(entity.id)
    selector.entityLabel.update(entity.id)
  }
}
