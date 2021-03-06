import EditorCSSClassForMode from './EditorCSSClassForMode'
import { MODE } from '../../../../../../MODE'

export default class Transition {
  constructor(editor, entityGap, noEdit, editEntity, editBlock, editRelation) {
    this._editor = editor
    this._editorCSSClassForMode = new EditorCSSClassForMode(editor[0])
    this._entityGap = entityGap
    this._noEdit = noEdit
    this._editEntity = editEntity
    this._editBlock = editBlock
    this._editRelation = editRelation
  }

  toViewWithoutRelation() {
    this._entityGap.show = false
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.VIEW_WITHOUT_RELATION
    )

    this._noEdit()
    this._editorCSSClassForMode.setViewWithoutRelation()
  }

  toViewWithRelation() {
    this._entityGap.show = true
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.VIEW_WITH_RELATION
    )

    this._noEdit()
    this._editorCSSClassForMode.setViewWithRelation()
  }

  toEditDenotationWithoutRelation() {
    this._entityGap.show = false
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )

    this._noEdit()
    this._editEntity()
    this._editorCSSClassForMode.setDenotationWithoutRelation()
  }

  toEditDenotationWithRelation() {
    this._entityGap.show = true
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_DENOTATION_WITH_RELATION
    )

    this._noEdit()
    this._editEntity()
    this._editorCSSClassForMode.setDenotationWithRelation()
  }

  toEditBlockWithoutRelation() {
    this._entityGap.show = false
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_BLOCK_WITHOUT_RELATION
    )

    this._noEdit()
    this._editBlock()
    this._editorCSSClassForMode.setBlockWithoutRelation()
  }

  toEditBlockWithRelation() {
    this._entityGap.show = true
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_BLOCK_WITH_RELATION
    )

    this._noEdit()
    this._editBlock()
    this._editorCSSClassForMode.setBlockWithRelation()
  }

  toEditRelation() {
    this._entityGap.show = true
    this._editor.eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_RELATION
    )

    this._noEdit()
    this._editRelation()
    this._editorCSSClassForMode.setRelation()
  }
}
