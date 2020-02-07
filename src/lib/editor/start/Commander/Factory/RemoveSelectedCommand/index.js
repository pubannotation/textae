import CompositeCommand from '../CompositeCommand'
import RemoveRelationAndAssociatesCommand from '../RemoveRelationAndAssociatesCommand'
import RemoveEntitiesAndRemeveSpanIfNoEntityRestCommand from './RemoveEntitiesAndRemeveSpanIfNoEntityRestCommand'
import RemoveSpanCommand from '../RemoveSpanCommand'

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
          new RemoveRelationAndAssociatesCommand(
            editor,
            annotationData,
            selectionModel,
            id
          )
      ),
      selectionModel.entity.some
        ? [
            new RemoveEntitiesAndRemeveSpanIfNoEntityRestCommand(
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
