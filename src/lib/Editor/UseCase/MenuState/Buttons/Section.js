import isAndroid from '../../../isAndroid'
import isTouchable from '../../../isTouchable'

function isIOS() {
  // iPad Safari (iPadOS 14 or later) does not include the string iPad in its userAgent.
  // see https://iwb.jp/ipad-safari-javascript-useragent-is-not-ipad/
  return (
    /iPad/.test(navigator.userAgent) ||
    /iPhone/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && isTouchable())
  )
}

export default class Section {
  #usage
  #buttonList

  constructor(usage, buttonList) {
    this.#usage = usage
    this.#buttonList = buttonList
  }

  isShowOnControlBar() {
    if (isAndroid() || isIOS()) {
      return this.#usage['touch device'].includes('control bar')
    } else {
      return this.#usage['keyboard device'].includes('control bar')
    }
  }

  isShowOnContextMenu() {
    if (isTouchable()) {
      return this.#usage['touch device'].includes('context menu')
    } else {
      return this.#usage['keyboard device'].includes('context menu')
    }
  }

  getButtonsFor(mode) {
    const buttonList = this.#buttonList.filter(({ availableModes }) =>
      availableModes.includes(mode)
    )
    return new Section(this.#usage, buttonList)
  }

  get buttonList() {
    return this.#buttonList
  }

  get displayProperties() {
    return { list: this.#buttonList.map((button) => button.displayProperties) }
  }
}
