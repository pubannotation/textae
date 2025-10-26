import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

export default class MoveBlockSpanCommand extends AnnotationCommand {
  #spanInstanceContainer
  #beginBeforeMove
  #endBeforeMove
  #beginAfterMove
  #endAfterMove

  constructor(
    spanInstanceContainer,
    beginBeforeMove,
    endBeforeMove,
    beginAfterMove,
    endAfterMove
  ) {
    super()
    this.#spanInstanceContainer = spanInstanceContainer
    this.#beginBeforeMove = beginBeforeMove
    this.#endBeforeMove = endBeforeMove
    this.#beginAfterMove = beginAfterMove
    this.#endAfterMove = endAfterMove
  }

  execute() {
    // Update instance.
    this.#spanInstanceContainer.moveBlockSpan(
      this.#beginBeforeMove,
      this.#endBeforeMove,
      this.#beginAfterMove,
      this.#endAfterMove
    )

    commandLog(
      this,
      `move span: from {begin: ${this.#beginBeforeMove}, end: ${this.#endBeforeMove} } to {begin: ${this.#beginAfterMove}, end: ${this.#endAfterMove}}`
    )
  }

  revert() {
    return new MoveBlockSpanCommand(
      this.#spanInstanceContainer,
      this.#beginAfterMove,
      this.#endAfterMove,
      this.#beginBeforeMove,
      this.#endBeforeMove
    )
  }
}
