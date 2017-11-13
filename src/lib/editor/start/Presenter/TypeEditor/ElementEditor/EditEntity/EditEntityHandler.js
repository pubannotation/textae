import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeContainer, command, annotationData, selectionModel) {
    super()
    this.typeContainer = typeContainer.entity
    this.command = command
    this.annotationData = annotationData.entity
    this.selectionModel = selectionModel.entity
  }
  changeTypeOfSelectedElement(newType) {
    return this.getEditTarget(newType)
      .map((id) => this.command.factory.entityChangeTypeCommand(
        id,
        newType,
        this.typeContainer.isBlock(newType)
      ))
  }
  changeColorOfType(id, newColor) {
    return [this.command.factory.typeChangeColorCommand(this.typeContainer, id, newColor)]
  }
  selectAll(id) {
    this.selectionModel.clear()
    this.annotationData.all().map((entity) => {
      if (entity.type === id) {
        this.selectionModel.add(entity.id)
      }
    })
  }
  removeType(id, label) {
    let removeType = {
      id: id,
      label: label || ''
    }

    if (typeof id === "undefined") {
      throw new Error('You must set the type id to remove.')
    }

    return [this.command.factory.typeRemoveCommand(this.typeContainer, removeType)]
  }
}
