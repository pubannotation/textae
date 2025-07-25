export default class EditModeBase {
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
  updateSelectedTextOffsets() {}
}
