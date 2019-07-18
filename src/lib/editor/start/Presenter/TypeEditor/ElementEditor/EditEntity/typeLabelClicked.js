import selectEntities from './selectEntities'

export default function(selectionModel, e) {
  const typeLabel = e.target
  const isTypeLabel = typeLabel.classList.contains('textae-editor__type-label')

  if (isTypeLabel) {
    const entities = e.target.previousElementSibling.children

    return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities)
  }

  return null
}
