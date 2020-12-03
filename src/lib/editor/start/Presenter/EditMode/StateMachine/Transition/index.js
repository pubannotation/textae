import EditorCSSClassForMode from './EditorCSSClassForMode'
import { MODE } from '../../../../../../MODE'

export default class Transition {
  constructor(
    editor,
    displayInstance,
    noEdit,
    editEntity,
    editBlock,
    editRelation
  ) {
    this._editor = editor
    this._editorCSSClassForMode = new EditorCSSClassForMode(editor[0])
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
    this._editorCSSClassForMode.setViewWithoutRelation()
  }

  toViewWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.VIEW_WITH_RELATION
    )

    this._noEdit()
    this._editorCSSClassForMode.setViewWithRelation()
  }

  toEditDenotationWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )

    this._noEdit()
    this._editEntity()
    this._editorCSSClassForMode.setDenotationWithoutRelation()
  }

  toEditDenotationWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_DENOTATION_WITH_RELATION
    )

    this._noEdit()
    this._editEntity()
    this._editorCSSClassForMode.setDenotationWithRelation()
  }

  toEditBlockWithoutRelation() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_BLOCK_WITHOUT_RELATION
    )

    this._noEdit()
    this._editBlock()
    this._editorCSSClassForMode.setBlockWithoutRelation()
  }

  toEditBlockWithRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_BLOCK_WITH_RELATION
    )

    this._noEdit()
    this._editBlock()
    this._editorCSSClassForMode.setBlockWithRelation()
  }

  toEditRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      MODE.EDIT_RELATION
    )

    this._noEdit()
    this._editRelation()
    this._editorCSSClassForMode.setRelation()
  }
}
