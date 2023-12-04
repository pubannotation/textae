import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class RemoveRelationAndAssociatesCommand extends CompositeCommand {
  constructor(annotationModel, relation) {
    super()
    const removeRelation = new RemoveCommand(
      annotationModel,
      'relation',
      relation
    )
    const removeAttribute = relation.attributes.map(
      (attribute) => new RemoveCommand(annotationModel, 'attribute', attribute)
    )

    this._subCommands = removeAttribute.concat(removeRelation)
    this._logMessage = `remove a relation ${relation.id}`
  }
}
