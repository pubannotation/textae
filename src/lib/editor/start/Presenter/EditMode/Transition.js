import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'
import { MODE } from '../../../../MODE'

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
      MODE.VIEW_WITHOUT_RELATION
    )

    this._typeEditor.cancelSelect()
    this._typeEditor.noEdit()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, false)
  }

  toViewWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.VIEW_WITH_RELATION
    )

    this._typeEditor.cancelSelect()
    this._typeEditor.noEdit()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, false)
  }

  toEditDenotationWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )

    this._typeEditor.cancelSelect()
    this._typeEditor.editEntity()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, true)
  }

  toEditDenotationWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_DENOTATION_WITH_RELATION
    )

    this._typeEditor.cancelSelect()
    this._typeEditor.editEntity()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, true)
  }

  toEditRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_RELATION
    )

    this._typeEditor.cancelSelect()
    this._typeEditor.editRelation()
    this._viewMode.setRelation()
    setEditableStyle(this._editor, true)
  }
}
