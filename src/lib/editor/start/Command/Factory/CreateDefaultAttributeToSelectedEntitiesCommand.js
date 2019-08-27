import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    this._subCommands = selectionModel.entity.all().map((entityId) => {
      return new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        true,
        {
          id: null,
          subj: entityId,
          pred: 'some_predicate',
          obj: 'some_value'
        }
      )
    })
  }
}
