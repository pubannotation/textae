// A parameter entities is a HTMLCollection. It does not have the forEach method.
export default function(selectionModel, entities) {
  for (const entity of entities) {
    selectionModel.entity.add(entity.title)
  }
}
