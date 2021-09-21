import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import RemoveRelationAndAssociatesCommand from './RemoveRelationAndAssociatesCommand'

export default class RemoveEntityAndAssociatesCommand extends CompositeCommand {
  constructor(annotationData, entity) {
    super()
    const removeEntity = new RemoveCommand(annotationData, 'entity', entity)
    const removeRelation = entity.relations.map(
      (relation) =>
        new RemoveRelationAndAssociatesCommand(annotationData, relation)
    )
    const removeAttribute = entity.attributes.map(
      (attribute) => new RemoveCommand(annotationData, 'attribute', attribute)
    )

    this._subCommands = removeRelation
      .concat(removeAttribute)
      .concat(removeEntity)
    this._logMessage = `remove an entity ${entity.id}`
  }
}
