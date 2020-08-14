import selectEntities from './selectEntities'
import getTypeDomOfEntityDom from '../../../../../getTypeDomOfEntityDom'

export default function(selectionModel, e) {
  const entities = getTypeDomOfEntityDom(e.target).querySelectorAll(
    '.textae-editor__entity'
  )

  return selectEntities(
    selectionModel,
    e.ctrlKey || e.metaKey,
    e.target.closest('.textae-editor__type-values'),
    entities
  )
}
