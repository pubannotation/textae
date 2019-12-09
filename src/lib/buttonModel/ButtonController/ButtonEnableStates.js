export default class {
  constructor(editor, selectionModel, clipBoard) {
    this._editor = editor
    this._states = {}

    // Short cut name
    const hasCopy = () => clipBoard.clipBoard.length > 0
    const eOrR = () =>
      selectionModel.entity.some || selectionModel.relation.some

    // Check all associated anntation elements.
    // For exapmle, it should be that buttons associate with entitis is enable,
    // when deselect the span after select a span and an entity.
    this.predicates = createPredicates(selectionModel, hasCopy, eOrR)
  }

  set(button, enable) {
    this._states[button] = enable
  }

  propagate() {
    this._editor.eventEmitter.emit(
      'textae.control.buttons.change',
      this._states
    )
  }

  updateButtons(buttons) {
    for (const buttonName of buttons) {
      const predicate = this.predicates.get(buttonName)
      this.set(buttonName, predicate())
    }
  }
}

function createPredicates(selectionModel, hasCopy, eOrR) {
  return new Map([
    ['replicate', () => Boolean(selectionModel.span.single())],
    ['entity', () => selectionModel.span.some],
    ['delete', () => selectionModel.some],
    ['copy', () => selectionModel.span.some || selectionModel.entity.some],
    ['paste', () => hasCopy() && selectionModel.span.some],
    ['change-label', eOrR],
    ['negation', eOrR],
    ['speculation', eOrR],
    ['attribute', () => selectionModel.entity.some]
  ])
}
