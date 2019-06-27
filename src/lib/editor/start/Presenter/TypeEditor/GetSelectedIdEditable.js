export default class {
  getSelectedIdEditable() {
    if (this.selectionModel) {
      return this.selectionModel.all()
    }

    return []
  }
}
