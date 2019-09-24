export default function(pallet, selectionModel) {
  if (pallet.visibly) {
    pallet.hide()
  } else {
    selectionModel.clear()
  }
}
