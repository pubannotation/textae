import Modifier from '../../Modifier'
import create from './create'
import removeEntityElement from './removeEntityElement'
import updateAncestorsElement from './updateAncestorsElement'

export default function(
  editor,
  annotationData,
  selectionModel,
  typeContainer,
  gridRenderer,
  entity
) {
  const modifier = new Modifier(editor, annotationData)

  // Remove an old entity.
  const paneElement = removeEntityElement(editor, entity.id)

  // Remove old entity after add new one, because grids will be removed unless entities.
  // Show a new entity.
  create(editor, typeContainer, gridRenderer, entity, annotationData.namespace)

  // Remove an parentNode unless entity.
  updateAncestorsElement(paneElement)

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    modifier.entity.select(entity.id)
    modifier.entityLabel.update(entity.id)
  }
}
