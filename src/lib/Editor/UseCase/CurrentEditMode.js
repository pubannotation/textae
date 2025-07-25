import { MODE } from '../../MODE'
import debounce300 from '../../debounce300'
import forwardMethods from '../forwardMethods'

export default class CurrentEditMode {
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
    viewMode,
    eventEmitter
  ) {
    this.#editModeState = editModeState
    this.#termEditMode = termEditMode
    this.#blockEditMode = blockEditMode
    this.#relationEditMode = relationEditMode
    this.#textEditMode = textEditMode
    this.#viewMode = viewMode

    const updateSelectedTextHandler = debounce300(() =>
      this.#current.updateSelectedTextOffsets()
    )

    document.addEventListener('selectionchange', updateSelectedTextHandler)

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.#current.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (_, entity) =>
        this.#current.relationBollardClicked(entity)
      )

    forwardMethods(this, () => this.#current, [
      'showPallet',
      'hidePallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab',
      'createSpanWithTouchDevice',
      'expandSpanWithTouchDevice',
      'shrinkSpanWithTouchDevice',
      'editTextWithTouchDevice',
      'applyTextSelectionWithTouchDevice',
      'editProperties',
      'manipulateAttribute'
    ])
  }

  get isEditDenotation() {
    return this.#editModeState.currentState === MODE.EDIT_DENOTATION
  }

  get isTypeValuesPalletShown() {
    return this.#current.isPalletShown
  }

  get #current() {
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
