import dohtml from 'dohtml'

import bindEventHandler from './bindEventHandler'

// The control is a control bar in an editor.
export default class Menu {
  #el

  constructor(html, iconEventMap) {
    const el = dohtml.create(html)

    this.#el = el
    bindEventHandler(this.#el, iconEventMap)
  }

  get el() {
    return this.#el
  }

  // protected method
  _querySelector(selector) {
    return this.#el.querySelector(selector)
  }
}
