import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class RemoveRelationAndAssociatesCommand extends CompositeCommand {
  constructor(editor, annotationData, relation) {
    super()
    const removeRelation = new RemoveCommand(
      editor,
      annotationData,
      'relation',
      relation.id
    )
    const removeAttribute = relation.typeValues.attributes.map(
      (attribute) =>
        new RemoveCommand(editor, annotationData, 'attribute', attribute.id)
    )

    this._subCommands = removeAttribute.concat(removeRelation)
    this._logMessage = `remove a relation ${relation.id}`
  }
}
