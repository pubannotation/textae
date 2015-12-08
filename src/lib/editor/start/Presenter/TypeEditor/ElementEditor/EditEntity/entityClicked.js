import dismissBrowserSelection from '../../dismissBrowserSelection'

export default function(selectionModel, e) {
  dismissBrowserSelection()

  if (e.ctrlKey || e.metaKey) {
    selectionModel.entity.toggle(e.target.title)
  } else {
    selectionModel.clear()
    selectionModel.entity.add(e.target.title)
  }
  return false
}
