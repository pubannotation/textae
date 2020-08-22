import CompositeCommand from './CompositeCommand'
import ChangeTypeCommand from './ChangeTypeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newType) {
    super()

    const selectedElements = selectionModel.relation.all
      .filter((relation) => relation.typeName !== newType)
      .map((relation) => relation.id)

    this._subCommands = selectedElements.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'relation', id, newType)
    )
    this._logMessage = `set type ${newType} to relations ${selectedElements}`
  }
}
