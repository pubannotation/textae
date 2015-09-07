export default function(selectionModel, id) {
  console.assert(selectionModel, 'selectionModel MUST not be undefined.')
  console.assert(id, 'id MUST not be undefined.')

  selectionModel.clear()
  selectionModel.entity.add(id)
}
