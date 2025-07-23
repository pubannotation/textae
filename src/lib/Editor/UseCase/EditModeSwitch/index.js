export default class EditModeSwitch {
  #editModeState
  #startUpOptions
  #editMode
  #relationInstanceContainer

  /**
   *
   * @param {import('../../StartUpOptions').default} startUpOptions
   */
  constructor(
    startUpOptions,
    editModeState,
    editMode,
    relationInstanceContainer
  ) {
    this.#editMode = editMode

    this.#editModeState = editModeState
    this.#relationInstanceContainer = relationInstanceContainer
    this.#startUpOptions = startUpOptions
  }

  toViewMode() {
    this.#hidePallet()
    this.#editModeState.toViewMode(this.#editModeState.nextShowRelation)
  }

  toTermEditMode() {
    this.#hidePallet()
    this.#editModeState.toTermEditMode(this.#editModeState.nextShowRelation)
  }

  toBlockEditMode() {
    this.#hidePallet()
    this.#editModeState.toBlockEditMode(this.#editModeState.nextShowRelation)
  }

  toRelationEditMode() {
    this.#hidePallet()
    this.#editModeState.toRelationEditMode()
  }

  toTextEditMode() {
    this.#hidePallet()
    this.#editModeState.toTextEditMode(this.#editModeState.nextShowRelation)
  }

  toggleSimpleMode() {
    this.#hidePallet()
    this.#editModeState.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this.#hidePallet()
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

  #hidePallet() {
    this.#editMode.hidePallet()
  }
}
