import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'
import { MODE } from '../../../../../../MODE'

export default class {
  constructor(
    editor,
    displayInstance,
    noEdit,
    editEntity,
    editBlock,
    editRelation
  ) {
    this._editor = editor
    this._viewMode = new ViewMode(editor)
    this._displayInstance = displayInstance
    this._noEdit = noEdit
    this._editEntity = editEntity
    this._editBlock = editBlock
    this._editRelation = editRelation
  }

  toViewWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.VIEW_WITHOUT_RELATION
    )

    this._noEdit()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, false)
  }

  toViewWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.VIEW_WITH_RELATION
    )

    this._noEdit()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, false)
  }

  toEditDenotationWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )

    this._editEntity()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, true)
  }

  toEditDenotationWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_DENOTATION_WITH_RELATION
    )

    this._editEntity()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, true)
  }

  toEditBlockWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_BLOCK_WITHOUT_RELATION
    )

    this._editBlock()
    this._viewMode.setBlock()
    setEditableStyle(this._editor, true)
  }

  toEditBlockWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_BLOCK_WITH_RELATION
    )

    this._editBlock()
    this._viewMode.setBlock()
    setEditableStyle(this._editor, true)
  }

  toEditRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_RELATION
    )

    this._editRelation()
    this._viewMode.setRelation()
    setEditableStyle(this._editor, true)
  }
}
