import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()

    const entities = selectionModel.entity.all()
    const pred = 'some_predicate'
    const obj = 'some_value'

    this._subCommands = entities.map((subj) => {
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
