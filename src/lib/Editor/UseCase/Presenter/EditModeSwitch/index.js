import { MODE } from '../../../../MODE'
import TermEditMode from './TermEditMode'
import BlockEditMode from './BlockEditMode'
import RelationEditMode from './RelationEditMode'
import ModeTransitionReactor from './ModeTransitionReactor'
import TextEditMode from './TextEditMode'
import EditMode from './EditMode'

export default class EditModeSwitch {
  #termEditMode
  #blockEditMode
  #relationEditMode
  #textEditMode
  #editModeState
  #annotationModel
  #startUpOptions

  /**
   *
   * @param {import('../../../StartUpOptions').default} startUpOptions
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    menuState,
    startUpOptions,
    functionAvailability,
    mousePoint,
    editModeState
  ) {
    this.#termEditMode = new TermEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      spanConfig,
      startUpOptions.autocompletionWs,
      mousePoint
    )

    this.#blockEditMode = new BlockEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      menuState,
      startUpOptions.autocompletionWs,
      mousePoint
    )

    this.#relationEditMode = new RelationEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      startUpOptions.autocompletionWs,
      menuState,
      mousePoint
    )

    this.#textEditMode = new TextEditMode(
      editorHTMLElement,
      annotationModel,
      spanConfig,
      menuState,
      commander
    )

    new ModeTransitionReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      this.#termEditMode,
      this.#blockEditMode,
      this.#relationEditMode,
      this.#textEditMode
    )

    this.#editModeState = editModeState
    this.#annotationModel = annotationModel
    this.#startUpOptions = startUpOptions

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.currentMode.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (event, entity) =>
        this.currentMode.relationBollardClicked(entity)
      )
  }

  toViewMode() {
    this.hidePallet()
    this.#editModeState.toViewMode(this.#editModeState.nextShowRelation)
  }

  toTermEditMode() {
    this.hidePallet()
    this.#editModeState.toTermEditMode(this.#editModeState.nextShowRelation)
  }

  toBlockEditMode() {
    this.hidePallet()
    this.#editModeState.toBlockEditMode(this.#editModeState.nextShowRelation)
  }

  toRelationEditMode() {
    this.hidePallet()
    this.#editModeState.toRelationEditMode()
  }

  toTextEditMode() {
    this.hidePallet()
    this.#editModeState.toTextEditMode(this.#editModeState.nextShowRelation)
  }

  toggleSimpleMode() {
    this.hidePallet()
    this.#editModeState.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this.hidePallet()
    this.#editModeState.changeModeByShortcut()
  }

  get isEditDenotation() {
    return this.#editModeState.currentState === MODE.EDIT_DENOTATION
  }

  /**
   * For an initiation transition on an annotations data loaded.
   */
  reset() {
    if (this.#startUpOptions.isEditTermMode) {
      this.#editModeState.toTermEditMode(
        this.#annotationModel.relationInstanceContainer.some
      )
      return
    }

    if (this.#startUpOptions.isEditBlockMode) {
      this.#editModeState.toBlockEditMode(
        this.#annotationModel.relationInstanceContainer.some
      )
      return
    }

    if (this.#startUpOptions.isEditRelationMode) {
      this.#editModeState.toRelationEditMode()
      return
    }

    if (this.#startUpOptions.isTextEditMode) {
      this.#editModeState.toTextEditMode(
        this.#annotationModel.relationInstanceContainer.some
      )
      return
    }

    this.#editModeState.toViewMode(
      this.#annotationModel.relationInstanceContainer.some
    )
  }

  hidePallet() {
    this.currentMode.hidePallet()
  }

  get isTypeValuesPalletShown() {
    return this.currentMode.isPalletShown
  }

  selectLeftAttributeTab() {
    this.currentMode.pallet.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this.currentMode.pallet.selectRightAttributeTab()
  }

  get currentMode() {
    switch (this.#editModeState.currentState) {
      case MODE.EDIT_DENOTATION:
        return this.#termEditMode
      case MODE.EDIT_BLOCK:
        return this.#blockEditMode
      case MODE.EDIT_RELATION:
        return this.#relationEditMode
      case MODE.EDIT_TEXT:
        return this.#textEditMode
      default:
        return new EditMode()
    }
  }
}
