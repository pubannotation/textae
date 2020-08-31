import isUri from '../../isUri'
import getAreaIn from './getAreaIn'

export default class {
  constructor(editor) {
    this._container = editor[0]
  }

  status(message) {
    if (message !== '') {
      getAreaIn(this._container).innerHTML = isUri(message)
        ? `Source: ${`<a class="textae-editor__footer__message__link" href="${message}">${decodeURI(
            message
          )}</a>`}`
        : `Source: ${message}`
    }
  }
}
