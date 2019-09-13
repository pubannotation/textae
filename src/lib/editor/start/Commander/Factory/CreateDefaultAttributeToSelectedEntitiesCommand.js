import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'
import withOutSamePredicateAttribute from './withOutSamePredicateAttribute'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    const entities = selectionModel.entity.all()
    const pred = 'some_predicate'
    const obj = 'some_value'

    this._subCommands = entities
      .filter((entityId) =>
        // An entity cannot have more than one attribute with the same predicate.
        withOutSamePredicateAttribute(annotationData, entityId, pred)
      )
      .map((subj) => {
        return new CreateCommand(
          editor,
          annotationData,
          selectionModel,
          'attribute',
          true,
          {
            id: null,
            subj,
            pred,
            obj
          }
        )
      })
    this._logMessage = `create attirbute ${pred}:${obj} to entity ${entities.join(
      ', '
    )}`
  }
}
