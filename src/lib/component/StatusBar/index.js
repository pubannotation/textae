import isUri from '../../isUri'
import getAreaIn from './getAreaIn'

export default class StatusBar {
  constructor(editorHTMLElement) {
    this._editorHTMLElement = editorHTMLElement
  }

  set status(dataSource) {
    const message = dataSource.displayName

    if (message !== '') {
      getAreaIn(this._editorHTMLElement).innerHTML = isUri(message)
        ? `Source: ${`<a class="textae-editor__footer__message__link" href="${message}">${decodeURI(
            message
          )}</a>`}`
        : `Source: ${message}`
    }
  }
}
