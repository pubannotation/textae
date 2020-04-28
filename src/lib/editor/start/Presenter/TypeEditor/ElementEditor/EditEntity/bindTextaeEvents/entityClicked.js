export default function(selectionModel, e) {
  if (e.ctrlKey || e.metaKey) {
    selectionModel.entity.toggle(e.target.title)
  } else {
    selectionModel.clear()
    selectionModel.entity.add(e.target.title)
  }

  e.stopPropagation()
}
