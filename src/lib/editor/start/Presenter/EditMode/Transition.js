import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'

const TERM = 'term'
const INSTANCE = 'instance'
const RELATION = 'relation'

export default class {
  constructor(editor, annotationData, typeEditor, displayInstance) {
    this._editor = editor
    this._typeEditor = typeEditor
    this._viewMode = new ViewMode(editor, annotationData)
    this._displayInstance = displayInstance
  }

  toTerm() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit('textae.editMode.transition', true, TERM)

    this._typeEditor.editEntity()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, true)
  }

  toInstance() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit('textae.editMode.transition', true, INSTANCE)

    this._typeEditor.editEntity()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, true)
  }

  toRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit('textae.editMode.transition', true, RELATION)

    this._typeEditor.editRelation()
    this._viewMode.setRelation()
    setEditableStyle(this._editor, true)
  }

  toViewTerm() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit('textae.editMode.transition', false, TERM)

    this._typeEditor.noEdit()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, false)
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
    setEditableStyle(this._editor, false)
  }
}
