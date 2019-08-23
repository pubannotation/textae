import invoke from '../invoke'
import invokeRevert from '../invokeRevert'
import { CreateCommand } from './commandTemplate'
import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class extends AnnotationCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanId,
    typeName,
    attributes = []
  ) {
    super()

    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._spanId = spanId
    this._typeName = typeName
    this._attributes = attributes
  }

  execute() {
    // Holds commands that was called to undo them.
    const entityCommand = this._createEntityCommand()
    const attributeCommands = this._createAttributesCommands(
      invoke([entityCommand]).pop().id // Only one entity was created.
    )
    invoke(attributeCommands)

    this.revert = () => ({
      execute() {
        invokeRevert([entityCommand].concat(attributeCommands))
        commandLog(`revert create a type for span: ${this.id}`)
      }
    })

    commandLog(`create a type for span: ${this._spanId}`)
  }

  _createEntityCommand() {
    return new CreateCommand(
      this._editor,
      this._annotationData,
      this._selectionModel,
      'entity',
      true,
      {
        span: this._spanId,
        type: this._typeName
      }
    )
  }

  _createAttributesCommands(subj) {
    return this._attributes.map(
      ({ obj, pred }) =>
        new CreateCommand(
          this._editor,
          this._annotationData,
          this._selectionModel,
          'attribute',
          true,
          {
            subj,
            obj,
            pred
          }
        )
    )
  }
}
