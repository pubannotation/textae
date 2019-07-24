import _ from 'underscore'

import { RemoveCommand } from './commandTemplate'
import entityAndAssociatesRemoveCommand from './entityAndAssociatesRemoveCommand'
import executeCompositCommand from './executeCompositCommand'

export default function(editor, annotationData, selectionModel, id) {
  const removeEntity = _.flatten(
    annotationData.span
      .get(id)
      .getTypes()
      .map((type) =>
        type.entities.map((entity) =>
          entityAndAssociatesRemoveCommand(
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
  const subCommands = removeEntity.concat(removeSpan)

  return {
    execute() {
      executeCompositCommand('span', this, 'remove', id, subCommands)
    }
  }
}
