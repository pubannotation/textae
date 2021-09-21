import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class RemoveRelationAndAssociatesCommand extends CompositeCommand {
  constructor(annotationData, relation) {
    super()
    const removeRelation = new RemoveCommand(
      annotationData,
      'relation',
      relation
    )
    const removeAttribute = relation.attributes.map(
      (attribute) => new RemoveCommand(annotationData, 'attribute', attribute)
    )

    this._subCommands = removeAttribute.concat(removeRelation)
    this._logMessage = `remove a relation ${relation.id}`
  }
}
