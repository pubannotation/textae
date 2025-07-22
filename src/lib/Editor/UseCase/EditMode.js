export default class EditMode {
  // Interface methods
  createSpanWithTouchDevice() {}
  expandSpanWithTouchDevice() {}
  shrinkSpanWithTouchDevice() {}
  editTextWithTouchDevice() {}
  editProperties() {}
  relationClicked() {}
  relationBollardClicked(entity) {
    entity.focus()
  }
  applyTextSelectionWithTouchDevice() {}
  manipulateAttribute() {}
  showPallet() {}
  hidePallet() {}
  get isPalletShown() {
    return false
  }
}
