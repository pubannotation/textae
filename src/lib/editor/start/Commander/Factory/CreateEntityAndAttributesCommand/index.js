import { CreateCommand } from '../commandTemplate'
import CompositeCommand from '../CompositeCommand'

export default class CreateEntityAndAttributesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    span,
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
          span,
          typeName
        },
        selectionModel
      )
    ].concat(
      attributes.map(
        ({ obj, pred }) =>
          // Only one entity was created.
          new CreateAttributeToTheLatestEntityCommand(
            editor,
            annotationData,
            obj,
            pred
          )
      )
    )

    this._logMessage = `create a type for span: ${span}`
  }
}

class CreateAttributeToTheLatestEntityCommand extends CreateCommand {
  constructor(editor, annotationData, obj, pred) {
    super(editor, annotationData, 'attribute', {
      obj,
      pred
    })
  }

  execute() {
    const subj = this._annotationData.entity.all.pop().id
    this._newModel.subj = subj
    return super.execute()
  }
}
