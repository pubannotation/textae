export default class EditModeSwitch {
  #editModeState
  #annotationModel
  #startUpOptions
  #editMode

  /**
   *
   * @param {import('../../StartUpOptions').default} startUpOptions
   */
  constructor(annotationModel, startUpOptions, editModeState, editMode) {
    this.#editMode = editMode

    this.#editModeState = editModeState
    this.#annotationModel = annotationModel
    this.#startUpOptions = startUpOptions
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
    return this.#editMode.isEditDenotation
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
}
