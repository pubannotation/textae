import selectEntities from './selectEntities'

export default function(selectionModel, e) {
  let typeLabel = e.target,
    isTypeLabel = typeLabel.classList.contains('textae-editor__type-label')

  if (isTypeLabel) {
    let entities = e.target.previousElementSibling.children

    return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities)
  }

  return null
}
