import { MODE } from '../../MODE'

export default class EditMode {
  #editModeState
  #termEditMode
  #blockEditMode
  #relationEditMode
  #textEditMode
  #viewMode

  constructor(
    editModeState,
    termEditMode,
    blockEditMode,
    relationEditMode,
    textEditMode,
    viewMode
  ) {
    this.#editModeState = editModeState
    this.#termEditMode = termEditMode
    this.#blockEditMode = blockEditMode
    this.#relationEditMode = relationEditMode
    this.#textEditMode = textEditMode
    this.#viewMode = viewMode
  }

  get current() {
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
        return this.#viewMode
    }
  }
}
