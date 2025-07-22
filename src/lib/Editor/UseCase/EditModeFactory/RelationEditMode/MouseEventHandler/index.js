import delegate from 'delegate'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'
import typeValuesClicked from './typeValuesClicked'

export default class MouseEventHandler {
  #editorHTMLElement
  #selectionModel
  #commander
  #typeDictionary
  #pallet

  constructor(
    editorHTMLElement,
    selectionModel,
    commander,
    typeDictionary,
    pallet
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#selectionModel = selectionModel
    this.#commander = commander
    this.#typeDictionary = typeDictionary
    this.#pallet = pallet
  }

  bind() {
    const listeners = []

    // In relation mode does not manipulate the child elements in the text box.
    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__text-box',
        'click',
        () => this.#bodyClicked()
      )
    )

    listeners.push(
      delegate(this.#editorHTMLElement, '.textae-editor', 'click', (e) => {
        // The delegate also fires events for child elements of the selector.
        // Ignores events that occur in child elements.
        // Otherwise, you cannot select child elements.
        if (e.target.classList.contains('textae-editor')) {
          this.#bodyClicked()
        }
      })
    )

    listeners.push(
      // When a relation is selected, the HTML element of the relation is recreated,
      // so the click event is not fired on the parent element.
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__signboard',
        'mousedown',
        () => this.#signboardClicked()
      )
    )

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__signboard__type-values',
        'click',
        (event) => {
          const entityID = getEntityHTMLelementFromChild(event.target).dataset
            .id
          this.#typeValuesClicked(event, entityID)
        }
      )
    )

    return listeners
  }

  #bodyClicked() {
    this.#pallet.hide()
    this.#selectionModel.removeAll()
  }

  #signboardClicked() {
    this.#editorHTMLElement.focus()
  }

  #typeValuesClicked(event, entityID) {
    typeValuesClicked(
      this.#selectionModel,
      this.#commander,
      this.#typeDictionary.relation,
      event,
      entityID
    )
  }
}
