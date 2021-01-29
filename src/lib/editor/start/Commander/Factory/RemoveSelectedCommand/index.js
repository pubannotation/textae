import CompositeCommand from '../CompositeCommand'
import RemoveSpanCommand from '../RemoveSpanCommand'
import { RemoveCommand } from '../commandTemplate'
import RemoveEntitiesAndRemoveSpanIfNoEntityRestCommand from './RemoveEntitiesAndRemoveSpanIfNoEntityRestCommand'

export default class RemoveSelectedCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    const selectedSpans = selectionModel.span.all.map((span) => span.id)
    const selectedRelations = selectionModel.relation.all.map(
      (relation) => relation.id
    )

    this._subCommands = [].concat(
      selectedRelations.map(
        (id) => new RemoveCommand(editor, annotationData, 'relation', id)
      ),
      selectionModel.entity.some
        ? [
            new RemoveEntitiesAndRemoveSpanIfNoEntityRestCommand(
              editor,
              annotationData,
              selectionModel
            )
          ]
        : [],
      selectedSpans.map(
        (id) =>
          new RemoveSpanCommand(editor, annotationData, selectionModel, id)
      )
    )
    this._logMessage = `remove selected ${selectedSpans
      .concat(selectionModel.entity.all.map((entity) => entity.id))
      .concat(selectedRelations)}`
  }
}
