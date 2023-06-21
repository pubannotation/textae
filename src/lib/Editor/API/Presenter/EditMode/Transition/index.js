import EditorCSSClassForMode from './EditorCSSClassForMode'
import { MODE } from '../../../../../MODE'

export default class Transition {
  constructor(
    eventEmitter,
    editorHTMLElement,
    typeGap,
    noEdit,
    editEntity,
    editBlock,
    editRelation
  ) {
    this._eventEmitter = eventEmitter
    this._editorCSSClassForMode = new EditorCSSClassForMode(editorHTMLElement)
    this._typeGap = typeGap
    this._noEdit = noEdit
    this._editEntity = editEntity
    this._editBlock = editBlock
    this._editRelation = editRelation
  }

  toView(showRelation) {
    this._typeGap.show = showRelation
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.VIEW,
      showRelation
    )

    this._noEdit()
    if (showRelation) {
      this._editorCSSClassForMode.setViewWithRelation()
    } else {
      this._editorCSSClassForMode.setViewWithoutRelation()
    }
  }

  toEditDenotation(showRelation) {
    this._typeGap.show = showRelation
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_DENOTATION,
      showRelation
    )

    this._noEdit()
    this._editEntity()
    if (showRelation) {
      this._editorCSSClassForMode.setDenotationWithRelation()
    } else {
      this._editorCSSClassForMode.setDenotationWithoutRelation()
    }
  }

  toEditBlock(showRelation) {
    this._typeGap.show = showRelation
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_BLOCK,
      showRelation
    )

    this._noEdit()
    this._editBlock()

    if (showRelation) {
      this._editorCSSClassForMode.setBlockWithRelation()
    } else {
      this._editorCSSClassForMode.setBlockWithoutRelation()
    }
  }

  toEditRelation() {
    this._typeGap.show = true
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_RELATION,
      true
    )

    this._noEdit()
    this._editRelation()
    this._editorCSSClassForMode.setRelation()
  }
}
