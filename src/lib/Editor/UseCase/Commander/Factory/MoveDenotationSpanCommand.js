import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

export default class MoveDenotationSpanCommand extends AnnotationCommand {
  /** @type {import('../../../AnnotationModel/SpanInstanceContainer').default} */
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
    this.#spanInstanceContainer.moveDenotationSpan(
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
    return new MoveDenotationSpanCommand(
      this.#spanInstanceContainer,
      this.#beginAfterMove,
      this.#endAfterMove,
      this.#beginBeforeMove,
      this.#endBeforeMove
    )
  }
}
