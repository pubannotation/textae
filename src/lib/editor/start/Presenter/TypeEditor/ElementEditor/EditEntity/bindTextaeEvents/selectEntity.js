export default function(ctrlKey, selectionModel, entityDom) {
  if (ctrlKey) {
    selectionModel.entity.toggle(entityDom.title)
  } else {
    selectionModel.clear()
    selectionModel.entity.add(entityDom.title)
  }
}
