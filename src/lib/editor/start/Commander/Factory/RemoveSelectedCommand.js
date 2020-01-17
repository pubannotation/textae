import CompositeCommand from './CompositeCommand'
import RelationAndAssociatesRemoveCommand from './RelationAndAssociatesRemoveCommand'
import EntitiesRemoveAndSpanRemeveIfNoEntityRestCommand from './EntitiesRemoveAndSpanRemeveIfNoEntityRestCommand'
import SpanRemoveCommand from './SpanRemoveCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    const selectedSpans = selectionModel.span.all.map((span) => span.id)
    const selectedRelations = selectionModel.relation.all.map(
      (relation) => relation.id
    )

    this._subCommands = [].concat(
      selectedRelations.map(
        (id) =>
          new RelationAndAssociatesRemoveCommand(
            editor,
            annotationData,
            selectionModel,
            id
          )
      ),
      selectionModel.entity.some
        ? [
            new EntitiesRemoveAndSpanRemeveIfNoEntityRestCommand(
              editor,
              annotationData,
              selectionModel
            )
          ]
        : [],
      selectedSpans.map(
        (id) =>
          new SpanRemoveCommand(editor, annotationData, selectionModel, id)
      )
    )
    this._logMessage = `remove selected ${selectedSpans
      .concat(selectionModel.entity.all.map((entity) => entity.id))
      .concat(selectedRelations)}`
  }
}
