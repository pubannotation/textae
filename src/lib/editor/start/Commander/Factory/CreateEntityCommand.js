import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class CreateEntityCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanId,
    typeName,
    attributes
  ) {
    super()

    this._subCommands = [
      new CreateCommand(
        editor,
        annotationData,
        'entity',
        {
          span: spanId,
          typeName
        },
        selectionModel
      )
    ].concat(
      attributes.map(
        ({ obj, pred }) =>
          new CreateAttribtueToTheLatestEntityCommand(
            editor,
            annotationData,
            'attribute',
            {
              obj,
              pred
            }
          )
      )
    )

    this._logMessage = `create a type for span: ${spanId}`
  }
}

class CreateAttribtueToTheLatestEntityCommand extends CreateCommand {
  execute() {
    const subj = this._annotationData.entity.all.pop().id // Only one entity was created.
    this._newModel.subj = subj
    return super.execute()
  }
}
