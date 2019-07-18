import selectEntities from './selectEntities'
import getEntitiesDomOfType from '../../../../getEntitiesDomOfType'

export default function(selectionModel, e) {
  const typeLabel = e.target
  const isTypeLabel = typeLabel.classList.contains('textae-editor__type-label')

  if (isTypeLabel) {
    const entities = getEntitiesDomOfType(typeLabel)

    return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities)
  }

  return null
}
