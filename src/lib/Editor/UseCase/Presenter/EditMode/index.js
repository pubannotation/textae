import { MODE } from '../../../../MODE'
import State from './State'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import ModeReactor from './ModeReactor'

export default class EditMode {
  #editDenotation
  #editBlock
  #editRelation
  #state
  #annotationModel
  #selectionModel
  #inlineOptions

  /**
   *
   * @param {import('../../../HTMLInlineOptions').HTMLInlineOption} inlineOptions
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    controlViewModel,
    inlineOptions,
    functionAvailability,
    mousePoint
  ) {
    this.#editDenotation = new EditDenotation(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      controlViewModel,
      spanConfig,
      inlineOptions.autocompletionWs,
      mousePoint
    )

    this.#editBlock = new EditBlock(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      controlViewModel,
      inlineOptions.autocompletionWs,
      mousePoint
    )

    this.#editRelation = new EditRelation(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      inlineOptions.autocompletionWs,
      controlViewModel,
      mousePoint
    )

    new ModeReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      () => this.cancelSelect(),
      this.#editDenotation,
      this.#editBlock,
      this.#editRelation
    )

    this.#state = new State(
      annotationModel.relation,
      eventEmitter,
      functionAvailability
    )

    this.#annotationModel = annotationModel
    this.#selectionModel = selectionModel
    this.#inlineOptions = inlineOptions

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.currentEdit.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (event, entity) =>
        this.currentEdit.relationBollardClicked(entity)
      )
  }

  toViewMode() {
    this.#state.toViewMode(this.#state.nextShowRelation)
  }

  toTermMode() {
    this.#state.toTermMode(this.#state.nextShowRelation)
  }

  toBlockMode() {
    this.#state.toBlockMode(this.#state.nextShowRelation)
  }

  toRelationMode() {
    this.#state.toRelationMode()
  }

  toggleSimpleMode() {
    this.#state.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this.#state.changeModeByShortcut()
  }

  get isEditDenotation() {
    return this.#state.currentState === MODE.EDIT_DENOTATION
  }

  /**
   * For an initiation transition on an annotations data loaded.
   */
  reset() {
    if (this.#inlineOptions.isTermEditMode) {
      this.#state.toTermMode(this.#annotationModel.relation.some)
      return
    }

    if (this.#inlineOptions.isBlockEditMode) {
      this.#state.toBlockMode(this.#annotationModel.relation.some)
      return
    }

    if (this.#inlineOptions.isRelationEditMode) {
      this.#state.toRelationMode()
      return
    }

    this.#state.toViewMode(this.#annotationModel.relation.some)
  }

  cancelSelect() {
    // Close all pallets.
    this.#editDenotation.pallet.hide()
    this.#editBlock.pallet.hide()
    this.#editRelation.pallet.hide()

    this.#selectionModel.removeAll()
  }

  get isTypeValuesPalletShown() {
    return (
      this.#editDenotation.pallet.visibly ||
      this.#editBlock.pallet.visibly ||
      this.#editRelation.pallet.visibly
    )
  }

  selectLeftAttributeTab() {
    this.currentEdit.pallet.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this.currentEdit.pallet.selectRightAttributeTab()
  }

  get currentEdit() {
    switch (this.#state.currentState) {
      case MODE.EDIT_DENOTATION:
        return this.#editDenotation
      case MODE.EDIT_BLOCK:
        return this.#editBlock
      case MODE.EDIT_RELATION:
        return this.#editRelation
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
