import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'

const TERM = 'term'
const INSTANCE = 'instance'
const RELATION = 'relation'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeEditor,
    buttonStateHelper,
    displayInstance
  ) {
    this._editor = editor
    this._typeEditor = typeEditor
    this._viewMode = new ViewMode(
      editor,
      annotationData,
      selectionModel,
      buttonStateHelper
    )
    this._buttonStateHelper = buttonStateHelper
    this._displayInstance = displayInstance
  }

  toTerm() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit('textae.editMode.transition', true, TERM)

    this._typeEditor.editEntity()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, this._buttonStateHelper, true)
  }

  toInstance() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit('textae.editMode.transition', true, INSTANCE)

    this._typeEditor.editEntity()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, this._buttonStateHelper, true)
  }

  toRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit('textae.editMode.transition', true, RELATION)

    this._typeEditor.editRelation()
    this._viewMode.setRelation()
    setEditableStyle(this._editor, this._buttonStateHelper, true)
  }

  toViewTerm() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit('textae.editMode.transition', false, TERM)

    this._typeEditor.noEdit()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, this._buttonStateHelper, false)
  }

  toViewInstance() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      false,
      INSTANCE
    )

    this._typeEditor.noEdit()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, this._buttonStateHelper, false)
  }
}
