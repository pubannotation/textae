import CompositeCommand from '../CompositeCommand'
import RemoveSpanCommand from '../RemoveSpanCommand'
import RemoveEntitiesAndRemoveSpanIfNoEntityRestCommand from './RemoveEntitiesAndRemoveSpanIfNoEntityRestCommand'
import RemoveRelationAndAssociatesCommand from '../RemoveRelationAndAssociatesCommand'

export default class RemoveSelectedCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    const selectedSpans = selectionModel.span.all.map((span) => span.id)

    this._subCommands = [].concat(
      selectionModel.relation.all.map(
        (relation) =>
          new RemoveRelationAndAssociatesCommand(
            editor,
            annotationData,
            relation
          )
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
        (id) => new RemoveSpanCommand(editor, annotationData, id)
      )
    )
    this._logMessage = `remove selected ${selectedSpans
      .concat(selectionModel.entity.all.map((entity) => entity.id))
      .concat(selectionModel.relation.all.map((relation) => relation.id))}`
  }
}
