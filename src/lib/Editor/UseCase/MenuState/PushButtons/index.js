import { MODE } from '../../../../MODE'
import Buttons from '../Buttons'
import PushButton from './PushButton'

export default class PushButtons {
  #buttons

  constructor(eventEmitter) {
    this.#buttons = new Buttons().pushButtons.reduce((map, name) => {
      map.set(name, new PushButton(name, eventEmitter))
      return map
    }, new Map())

    // Bind an event.
    eventEmitter.on('textae-event.edit-mode.transition', (mode, withRelation) =>
      this.#setMode(mode, !withRelation)
    )
  }

  get(name) {
    return this.#buttons.has(name)
      ? this.#buttons.get(name)
      : new PushButton(name)
  }

  get names() {
    return this.#buttons.keys()
  }

  #setMode(mode, isSimple) {
    switch (mode) {
      case MODE.VIEW:
        this.#updateModeButtons(true, false, false, false, false, isSimple)
        break
      case MODE.EDIT_DENOTATION:
        this.#updateModeButtons(false, true, false, false, false, isSimple)
        break
      case MODE.EDIT_BLOCK:
        this.#updateModeButtons(false, false, true, false, false, isSimple)
        break
      case MODE.EDIT_RELATION:
        this.#updateModeButtons(false, false, false, true, false, false)
        break
      case MODE.EDIT_TEXT:
        this.#updateModeButtons(false, false, false, false, true, isSimple)
        break
      default:
        throw `unknown edit mode!${mode}`
    }
  }

  #updateModeButtons(
    view,
    editTerm,
    editBlock,
    editRelation,
    editText,
    simple
  ) {
    this.#buttons.get('view mode').isPushed = view
    this.#buttons.get('term edit mode').isPushed = editTerm
    this.#buttons.get('block edit mode').isPushed = editBlock
    this.#buttons.get('relation edit mode').isPushed = editRelation
    this.#buttons.get('text edit mode').isPushed = editText
    this.#buttons.get('simple view').isPushed = simple
  }
}
