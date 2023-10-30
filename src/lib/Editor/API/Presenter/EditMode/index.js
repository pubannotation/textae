import { MODE } from '../../../../MODE'
import State from './State'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import ModeReactor from './ModeReactor'

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
    params,
    functionAvailability,
    mousePoint
  ) {
    this._editDenotation = new EditDenotation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      controlViewModel,
      spanConfig,
      params.autocompletionWs,
      mousePoint
    )

    this._editBlock = new EditBlock(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      controlViewModel,
      params.autocompletionWs,
      mousePoint
    )

    this._editRelation = new EditRelation(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      commander,
      params.autocompletionWs,
      controlViewModel,
      mousePoint
    )

    new ModeReactor(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      () => this.cancelSelect(),
      this._editDenotation,
      this._editBlock,
      this._editRelation
    )

    this._state = new State(
      annotationData.relation,
      eventEmitter,
      functionAvailability
    )

    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._params = params

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.currentEdit.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (event, entity) =>
        this.currentEdit.relationBollardClicked(entity)
      )
  }

  toViewMode() {
    this._state.toViewMode(this._state.nextShowRelation)
  }

  toTermMode() {
    this._state.toTermMode(this._state.nextShowRelation)
  }

  toBlockMode() {
    this._state.toBlockMode(this._state.nextShowRelation)
  }

  toRelationMode() {
    this._state.toRelationMode()
  }

  toggleSimpleMode() {
    this._state.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this._state.changeModeByShortcut()
  }

  get isEditDenotation() {
    return this._state.currentState === MODE.EDIT_DENOTATION
  }

  /**
   * For an initiation transition on an annotations data loaded.
   */
  reset() {
    if (this._params.isTermEditMode) {
      this._state.toTermMode(this._annotationData.relation.some)
      return
    }

    if (this._params.isBlockEditMode) {
      this._state.toBlockMode(this._annotationData.relation.some)
      return
    }

    if (this._params.isRelationEditMode) {
      this._state.toRelationMode()
      return
    }

    this._state.toViewMode(this._annotationData.relation.some)
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
    switch (this._state.currentState) {
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
          relationBollardClicked(entity) {
            entity.focus()
          },
          applyTextSelection() {}
        }
    }
  }
}
