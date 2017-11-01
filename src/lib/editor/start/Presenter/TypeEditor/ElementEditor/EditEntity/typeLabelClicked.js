import selectEntities from './selectEntities'

export default function(selectionModel, e) {
  let typeLabel = e.target,
    entities = e.target.previousElementSibling.children

  return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities)
}
