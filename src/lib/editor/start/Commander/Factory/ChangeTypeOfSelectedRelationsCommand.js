import CompositeCommand from './CompositeCommand'
import ChangeTypeCommand from './ChangeTypeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newType) {
    super()

    const selectedElements = selectionModel.relation.all.filter(
      (id) => annotationData.relation.get(id).type.name !== newType
    )

    this._subCommands = selectedElements.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'relation', id, newType)
    )
    this._logMessage = `set type ${newType} to relations ${selectedElements}`
  }
}
