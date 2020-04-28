import selectEntities from './selectEntities'
import getEntitiesDomOfType from '../../../../../getEntitiesDomOfType'

export default function(selectionModel, e) {
  const entities = getEntitiesDomOfType(e.target)
  return selectEntities(
    selectionModel,
    e.ctrlKey || e.metaKey,
    e.target.closest('.textae-editor__type-values'),
    entities
  )
}
