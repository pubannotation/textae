import { MODE } from '../../../../MODE'
import StateMachine from './StateMachine'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import EditorCSS from './EditorCSS'

export default class EditMode {
  /**
   *
   * @param {import('../../../ParamsFromHTMLElement').default} params
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    controlViewModel,
    params
  ) {
    this._editDenotation = new EditDenotation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      controlViewModel,
      spanConfig,
      params.autocompletionWs
    )

    this._editBlock = new EditBlock(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      controlViewModel,
      params.autocompletionWs
    )

    this._editRelation = new EditRelation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      params.autocompletionWs,
      controlViewModel
    )

    this._listeners = []

    this._editorCSS = new EditorCSS(editorHTMLElement)
    this._stateMachine = new StateMachine(
      annotationData.relation,
      eventEmitter,
      editorHTMLElement,
      annotationData.typeGap,
      () => {
        this.cancelSelect()
        this._unbindAllMouseEventHandler()
        this._editorCSS.clear()
      },
      () => {},
      () => (this._listeners = this._editDenotation.bindMouseEvents()),
      () => (this._listeners = this._editBlock.bindMouseEvents()),
      () => (this._listeners = this._editRelation.bindMouseEvents())
    )

    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._params = params

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.currentEdit.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (event, entity) =>
        this.currentEdit.typeValuesClicked(event, entity)
      )
  }

  toViewMode() {
    this._stateMachine.toViewMode(this._stateMachine.nextShowRelation)
  }

  toTermMode() {
    this._stateMachine.toTermMode(this._stateMachine.nextShowRelation)
  }

  toBlockMode() {
    this._stateMachine.toBlockMode(this._stateMachine.nextShowRelation)
  }

  toRelationMode() {
    this._stateMachine.toRelationMode()
  }

  toggleSimpleMode() {
    this._stateMachine.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this._stateMachine.changeModeByShortcut()
  }

  get isEditDenotation() {
    return this._stateMachine.currentState === MODE.EDIT_DENOTATION
  }

  /**
   * For an initiation transition on an annotations data loaded.
   */
  reset() {
    if (this._params.isTermEditMode) {
      this._stateMachine.toTermMode(this._annotationData.relation.some)
      return
    }

    if (this._params.isBlockEditMode) {
      this._stateMachine.toBlockMode(this._annotationData.relation.some)
      return
    }

    if (this._params.isRelationEditMode) {
      this._stateMachine.toRelationMode()
      return
    }

    this._stateMachine.toViewMode(this._annotationData.relation.some)
  }

  cancelSelect() {
    // Close all pallets.
    this._editDenotation.pallet.hide()
    this._editBlock.pallet.hide()
    this._editRelation.pallet.hide()

    this._selectionModel.removeAll()
  }

  get isTypeValuesPalletShown() {
    return (
      this._editDenotation.pallet.visibly ||
      this._editBlock.pallet.visibly ||
      this._editRelation.pallet.visibly
    )
  }

  selectLeftAttributeTab() {
    this.currentEdit.pallet.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this.currentEdit.pallet.selectRightAttributeTab()
  }

  get currentEdit() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION:
        return this._editDenotation
      case MODE.EDIT_BLOCK:
        return this._editBlock
      case MODE.EDIT_RELATION:
        return this._editRelation
      default:
        return {
          showPallet() {},
          selectLeftAttributeTab() {},
          selectRightAttributeTab() {},
          editProperties() {},
          manipulateAttribute() {},
          relationClicked() {},
          typeValuesClicked(_, entity) {
            entity.focus()
          },
          applyTextSelection() {}
        }
    }
  }

  _unbindAllMouseEventHandler() {
    for (const listener of this._listeners) {
      listener.destroy()
    }
    this._listeners = []
  }
}
