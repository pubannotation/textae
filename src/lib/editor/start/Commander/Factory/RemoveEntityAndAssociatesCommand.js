import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class RemoveEntityAndAssociatesCommand extends CompositeCommand {
  constructor(editor, annotationData, id) {
    super()
    const entity = annotationData.entity.get(id)
    const removeEntity = new RemoveCommand(
      editor,
      annotationData,
      'entity',
      entity.id
    )
    const removeRelation = entity.relations.map(
      (relation) =>
        new RemoveCommand(editor, annotationData, 'relation', relation.id)
    )
    const removeAttribute = entity.typeValues.attributes.map(
      (attribute) =>
        new RemoveCommand(editor, annotationData, 'attribute', attribute.id)
    )

    this._subCommands = removeRelation
      .concat(removeAttribute)
      .concat(removeEntity)
    this._logMessage = `remove an entity ${id}`
  }
}
