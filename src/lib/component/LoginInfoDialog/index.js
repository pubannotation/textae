import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import bind from './bind'

export default class extends Dialog {
  constructor(loginUrl) {
    super('Login is required', createContentHtml())

    bind(super.el, this, loginUrl)
  }
}
