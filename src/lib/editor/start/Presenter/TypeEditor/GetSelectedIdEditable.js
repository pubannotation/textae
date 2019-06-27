export default class {
  constructor(selectionModel) {
    this.selectionModel = selectionModel
  }

  getSelectedIdEditable() {
    if (this.selectionModel) {
      return this.selectionModel.all()
    }

    return []
  }
}
