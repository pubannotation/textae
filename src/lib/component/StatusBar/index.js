import getAreaIn from './getAreaIn'

export default class {
  constructor(editor) {
    this._container = editor[0]
  }

  status(message) {
    if (message !== '') {
      getAreaIn(this._container).innerHTML = `Source: ${message}`
    }
  }
}
