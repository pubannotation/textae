import dohtml from 'dohtml'

import isTouchable from '../../isTouchable'
import classify from '../classify'
import Menu from '../Menu'
import toContextMenuItem from './toContextMenuItem'

export default class ContextMenu extends Menu {
  #editorHTMLElement
  #menuState

  constructor(editorHTMLElement, menuState, iconEventMap) {
    super(
      `<div class="textae-control ${
        isTouchable() ? 'textae-android-context-menu' : 'textae-context-menu'
      }"></div>`,
      iconEventMap
    )

    this.#editorHTMLElement = editorHTMLElement
    this.#menuState = menuState
  }

  show(contextmenuEvent) {
    const selection = window.getSelection()
    const editorClientRect = this.#editorHTMLElement.getBoundingClientRect()

    if (isTouchable() && selection.rangeCount === 1) {
      const rectOfSelection = selection.getRangeAt(0).getBoundingClientRect()
      const rectOfTextBox = this.#editorHTMLElement
        .querySelector('.textae-editor__text-box')
        .getBoundingClientRect()

      this.#showAbove(
        rectOfSelection.y - editorClientRect.y,
        rectOfSelection.x - rectOfTextBox.x
      )
    } else {
      // The context menu is `position:absolute` in the editor.
      // I want the coordinates where you right-click with the mouse,
      // starting from the upper left of the editor.
      // So the Y coordinate is pageY minus the editor's offsetTop.
      this.#showLowerRight(
        contextmenuEvent.pageY - editorClientRect.y,
        contextmenuEvent.pageX - editorClientRect.x
      )
    }
  }

  hide() {
    if (this.#isOpen) {
      super.el.classList.remove('textae-context-menu--show')
      super.el.classList.add('textae-context-menu--hide')
    }
  }

  get #isOpen() {
    return super.el.classList.contains('textae-context-menu--show')
  }

  #showAbove(positionTop, positionLeft) {
    this.#show()

    const { height } = this.el.getBoundingClientRect()
    super.el.setAttribute(
      'style',
      `top: ${positionTop - height}px; left: ${positionLeft}px`
    )
  }

  #showLowerRight(positionTop, positionLeft) {
    this.#show()

    super.el.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
  }

  #show() {
    const context = classify(this.#menuState.contextMenuButton)
    if (context.length === 0) {
      // No context menu items to show.
      return
    }

    const html = `
    <div">
      ${context
        .map((list) => list.map(toContextMenuItem).join(''))
        .join('<p class="textae-control-separator"></p>\n')}
    </div>
    `
    super.el.replaceChildren(...dohtml.create(html).children)
    super.el.classList.remove('textae-context-menu--hide')
    super.el.classList.add('textae-context-menu--show')
  }
}
