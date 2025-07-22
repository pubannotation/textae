import { MODE } from '../../../MODE'
import ModeTransitionReactor from './ModeTransitionReactor'

export default class EditModeSwitch {
  #viewMode
  #editModeState
  #annotationModel
  #startUpOptions
  #editMode

  /**
   *
   * @param {import('../../StartUpOptions').default} startUpOptions
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    startUpOptions,
    editModeState,
    termEditMode,
    blockEditMode,
    relationEditMode,
    textEditMode,
    viewMode,
    editMode
  ) {
    this.#viewMode = viewMode
    this.#editMode = editMode

    new ModeTransitionReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      termEditMode,
      blockEditMode,
      relationEditMode,
      textEditMode
    )

    this.#editModeState = editModeState
    this.#annotationModel = annotationModel
    this.#startUpOptions = startUpOptions

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.#editMode.current.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (_, entity) =>
        this.#editMode.current.relationBollardClicked(entity)
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
    this.#editMode.current.hidePallet()
  }

  get isTypeValuesPalletShown() {
    return this.#editMode.current.isPalletShown
  }

  selectLeftAttributeTab() {
    this.#editMode.current.pallet.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this.#editMode.current.pallet.selectRightAttributeTab()
  }

  getSelectedText() {
    if (this.#editModeState.currentState === MODE.VIEW) {
      return this.#viewMode.selectedText
    } else {
      return {
        status: 'unselected'
      }
    }
  }
}
