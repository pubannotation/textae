import _ from 'underscore'

import { RemoveCommand } from './commandTemplate'
import EntityAndAssociatesRemoveCommand from './EntityAndAssociatesRemoveCommand'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, id) {
    super()
    const removeEntity = _.flatten(
      annotationData.span
        .get(id)
        .types.map((type) =>
          type.entities.map(
            (entity) =>
              new EntityAndAssociatesRemoveCommand(
                editor,
                annotationData,
                selectionModel,
                entity.id
              )
          )
        )
    )
    const removeSpan = new RemoveCommand(
      editor,
      annotationData,
      selectionModel,
      'span',
      id
    )
    this.subCommands = removeEntity.concat(removeSpan)
    this.id = id
  }

  execute() {
    super.execute('span', 'remove', this.id, this.subCommands)
  }
}
