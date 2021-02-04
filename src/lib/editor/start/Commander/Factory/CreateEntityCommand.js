import invoke from '../invoke'
import invokeRevert from '../invokeRevert'
import { RemoveCommand } from './commandTemplate'
import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class CreateEntityCommand extends AnnotationCommand {
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
  }

  execute() {
    // Holds commands that was called to undo them.
    const entityCommand = this._createEntityCommand()
    invoke([entityCommand])
    const attributeCommands = this._createAttributesCommands()
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
      'entity',
      {
        span: this._spanId,
        typeName: this._typeName
      },
      this._selectionModel
    )
  }

  _createAttributesCommands() {
    return this._attributes.map(
      ({ obj, pred }) =>
        new CreateCommand(this._editor, this._annotationData, 'attribute', {
          obj,
          pred
        })
    )
  }
}

class CreateCommand extends AnnotationCommand {
  constructor(
    editor,
    annotationData,
    modelType,
    newModel,
    selectionModel = null
  ) {
    super()
    this._editor = editor
    this._annotationData = annotationData
    this._modelType = modelType
    this._newModel = newModel
    this._selectionModel = selectionModel
  }

  execute() {
    const subj = this._annotationData.entity.all.pop().id // Only one entity was created.
    this._newModel.subj = subj
    this._newModel = this._annotationData[this._modelType].add(this._newModel)

    if (this._selectionModel) {
      this._selectionModel.add(this._modelType, this._newModel.id)
    }
    commandLog(`create a new ${this._modelType}: ${this._newModel.id}`)

    return this._newModel
  }

  revert() {
    return new RemoveCommand(
      this._editor,
      this._annotationData,
      this._modelType,
      this._newModel.id
    )
  }
}
