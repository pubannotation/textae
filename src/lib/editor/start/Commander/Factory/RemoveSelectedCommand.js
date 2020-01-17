import CompositeCommand from './CompositeCommand'
import RelationAndAssociatesRemoveCommand from './RelationAndAssociatesRemoveCommand'
import EntitiesRemoveAndSpanRemeveIfNoEntityRestCommand from './EntitiesRemoveAndSpanRemeveIfNoEntityRestCommand'
import SpanRemoveCommand from './SpanRemoveCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    this._subCommands = [].concat(
      selectionModel.relation.all.map(
        (id) =>
          new RelationAndAssociatesRemoveCommand(
            editor,
            annotationData,
            selectionModel,
            id
          )
      ),
      selectionModel.entity.all.length === 0
        ? []
        : [
            new EntitiesRemoveAndSpanRemeveIfNoEntityRestCommand(
              editor,
              annotationData,
              selectionModel
            )
          ],
      selectionModel.span.all.map(
        (id) =>
          new SpanRemoveCommand(editor, annotationData, selectionModel, id)
      )
    )
    this._logMessage = `remove selected ${selectionModel.span.all
      .concat(selectionModel.entity.all)
      .concat(selectionModel.relation.all)}`
  }
}
