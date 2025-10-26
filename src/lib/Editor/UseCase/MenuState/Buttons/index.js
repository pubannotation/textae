import Button from './Button'
import { definition } from './definition'
import Section from './Section'

export default class Buttons {
  #sections

  constructor() {
    this.#sections = definition.map(({ usage, list }) => {
      return new Section(
        usage,
        list.map(
          ({ type, title, push, enableWhenSelecting, availableModes }) => {
            return new Button(
              type,
              title,
              push,
              enableWhenSelecting,
              availableModes
            )
          }
        )
      )
    })
  }

  // Buttons to display on the control bar.
  get controlBar() {
    return this.#sections
      .filter((section) => section.isShowOnControlBar())
      .map((section) => section.displayProperties)
  }

  // Buttons to display on the context menu.
  getContextMenuFor(mode) {
    return this.#sections
      .filter((section) => section.isShowOnContextMenu())
      .map((section) => section.getButtonsFor(mode))
      .map((section) => section.displayProperties)
  }

  get pasteButton() {
    return this.#buttonList.find(({ type }) => type === 'paste')
  }

  get enableButtonsWhenSelecting() {
    return this.#buttonList.filter((b) => b.enableWhenSelecting)
  }

  get pushButtons() {
    return this.#buttonList.filter((b) => b.push).map((b) => b.type)
  }

  get #buttonList() {
    return this.#sections.flatMap((section) => section.buttonList)
  }
}
