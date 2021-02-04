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

    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._spanId = spanId
    this._typeName = typeName
    this._attributes = attributes

    this._subCommands = [
      new CreateCommand(
        this._editor,
        this._annotationData,
        'entity',
        {
          span: this._spanId,
          typeName: this._typeName
        },
        this._selectionModel
      )
    ].concat(this._createAttributesCommands())

    this._logMessage = `create a type for span: ${this._spanId}`
  }

  _createAttributesCommands() {
    return this._attributes.map(
      ({ obj, pred }) =>
        new CreateAttribtueToTheLatestEntityCommand(
          this._editor,
          this._annotationData,
          'attribute',
          {
            obj,
            pred
          }
        )
    )
  }
}

class CreateAttribtueToTheLatestEntityCommand extends CreateCommand {
  execute() {
    const subj = this._annotationData.entity.all.pop().id // Only one entity was created.
    this._newModel.subj = subj
    return super.execute()
  }
}
