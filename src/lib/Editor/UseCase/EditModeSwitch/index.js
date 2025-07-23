// Switches the edit mode to the specified mode or initial state.
export default class EditModeSwitch {
  #editModeState
  #startUpOptions
  #relationInstanceContainer
  #hidePalletHandler

  /**
   *
   * @param {import('../../StartUpOptions').default} startUpOptions
   */
  constructor(
    startUpOptions,
    editModeState,
    relationInstanceContainer,
    hidePalletHandler
  ) {
    this.#startUpOptions = startUpOptions
    this.#editModeState = editModeState
    this.#relationInstanceContainer = relationInstanceContainer
    this.#hidePalletHandler = hidePalletHandler
  }

  toViewMode() {
    this.#hidePalletHandler()
    this.#editModeState.toViewMode(this.#editModeState.nextShowRelation)
  }

  toTermEditMode() {
    this.#hidePalletHandler()
    this.#editModeState.toTermEditMode(this.#editModeState.nextShowRelation)
  }

  toBlockEditMode() {
    this.#hidePalletHandler()
    this.#editModeState.toBlockEditMode(this.#editModeState.nextShowRelation)
  }

  toRelationEditMode() {
    this.#hidePalletHandler()
    this.#editModeState.toRelationEditMode()
  }

  toTextEditMode() {
    this.#hidePalletHandler()
    this.#editModeState.toTextEditMode(this.#editModeState.nextShowRelation)
  }

  toggleSimpleMode() {
    this.#hidePalletHandler()
    this.#editModeState.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this.#hidePalletHandler()
    this.#editModeState.changeModeByShortcut()
  }

  /**
   * For an initiation transition on an annotations data loaded.
   */
  reset() {
    if (this.#startUpOptions.isEditTermMode) {
      this.#editModeState.toTermEditMode(this.#relationInstanceContainer.some)
      return
    }

    if (this.#startUpOptions.isEditBlockMode) {
      this.#editModeState.toBlockEditMode(this.#relationInstanceContainer.some)
      return
    }

    if (this.#startUpOptions.isEditRelationMode) {
      this.#editModeState.toRelationEditMode()
      return
    }

    if (this.#startUpOptions.isTextEditMode) {
      this.#editModeState.toTextEditMode(this.#relationInstanceContainer.some)
      return
    }

    this.#editModeState.toViewMode(this.#relationInstanceContainer.some)
  }
}
