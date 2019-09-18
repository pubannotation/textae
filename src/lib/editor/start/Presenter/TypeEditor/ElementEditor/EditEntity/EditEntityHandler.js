import DefaultHandler from '../DefaultHandler'
import EditTypeDialog from '../../../../../../component/EditTypeDialog'

export default class extends DefaultHandler {
  constructor(typeDefinition, commander, annotationData, selectionModel) {
    super('entity', selectionModel, typeDefinition.entity, commander)

    this.annotationData = annotationData.entity
    this.selectionModel = selectionModel.entity
  }

  changeTypeOfSelectedElement(newType) {
    return this.commander.factory.changeTypeRemoveRelationOfSelectedEntitiesCommand(
      newType,
      this.typeContainer
    )
  }

  changeLabelHandler(autocompletionWs) {
    if (this.getSelectedIdEditable().length > 0) {
      const type = mergeTypes(
        this.selectionModel.all().map((id) => this.annotationData.get(id).type)
      )
      const done = (typeName, label, attributes) => {
        const commands = this.commander.factory.changeEntityTypeCommand(
          label,
          typeName,
          attributes,
          this.typeContainer
        )

        if (typeName) {
          this.commander.invoke(commands)
        }
      }

      const dialog = new EditTypeDialog(
        type,
        done,
        this.typeContainer,
        autocompletionWs
      )
      dialog.open()
    }
  }
}

function mergeTypes(types) {
  return types.reduce(
    (sum, type) => {
      sum.name = type.name
      for (const attribute of type.attributes) {
        if (sum.attributes.some((a) => a.pred === attribute.pred)) {
          sum.attributes.find((a) => a.pred === attribute.pred).obj =
            attribute.obj
        } else {
          sum.attributes.push(attribute)
        }
      }
      return sum
    },
    { name: '', attributes: [] }
  )
}
