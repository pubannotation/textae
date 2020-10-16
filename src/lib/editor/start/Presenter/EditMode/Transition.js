import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'
import { state } from '../../../../state'

export default class {
  constructor(editor, typeEditor, displayInstance) {
    this._editor = editor
    this._typeEditor = typeEditor
    this._viewMode = new ViewMode(editor)
    this._displayInstance = displayInstance
  }

  toViewWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      state.VIEW_WITHOUT_RELATION
    )

    this._typeEditor.noEdit()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, false)
  }

  toViewWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      state.VIEW_WITH_RELATION
    )

    this._typeEditor.noEdit()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, false)
  }

  toEditDenotationWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      state.EDIT_DENOTATION_WITHOUT_RELATION
    )

    this._typeEditor.editEntity()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, true)
  }

  toEditDenotationWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      state.EDIT_DENOTATION_WITH_RELATION
    )

    this._typeEditor.editEntity()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, true)
  }

  toEditRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      state.EDIT_RELATION
    )

    this._typeEditor.editRelation()
    this._viewMode.setRelation()
    setEditableStyle(this._editor, true)
  }
}
