import isURI from '../../../../isURI'
import getAreaIn from './getAreaIn'

export default class StatusBar {
  constructor(editorHTMLElement, isShow) {
    this._editorHTMLElement = editorHTMLElement
    this._isShow = isShow
  }

  set status(dataSource) {
    if (!this._isShow) {
      return
    }

    const message = dataSource.displayName

    if (message !== '') {
      getAreaIn(this._editorHTMLElement).innerHTML = isURI(message)
        ? `Source: ${`<a class="textae-editor__footer__message__link" href="${message}">${decodeURI(
            message
          )}</a>`}`
        : `Source: ${message}`
    }
  }
}
