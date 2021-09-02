import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class RemoveRelationAndAssociatesCommand extends CompositeCommand {
  constructor(editor, annotationData, relation) {
    super()
    const removeRelation = new RemoveCommand(
      editor,
      annotationData,
      'relation',
      relation
    )
    const removeAttribute = relation.attributes.map(
      (attribute) =>
        new RemoveCommand(editor, annotationData, 'attribute', attribute)
    )

    this._subCommands = removeAttribute.concat(removeRelation)
    this._logMessage = `remove a relation ${relation.id}`
  }
}
