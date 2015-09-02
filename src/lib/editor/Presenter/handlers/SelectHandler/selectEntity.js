export default function(selectionModel, id) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')
  console.assert(id, 'id MUST not undefined.')

  selectionModel.clear()
  selectionModel.entity.add(id)
}
