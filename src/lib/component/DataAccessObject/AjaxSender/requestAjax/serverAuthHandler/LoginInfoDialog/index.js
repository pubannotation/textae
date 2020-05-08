import Dialog from '../../../../../Dialog'
import createContentHtml from './createContentHtml'
import bind from './bind'
import openPopUp from './openPopUp'
import CookieHandler from './CookieHandler'

export default class extends Dialog {
  constructor(loginUrl) {
    super('Login is required', createContentHtml())

    this._loginUrl = loginUrl
    bind(super.el, this)
  }

  open() {
    const isHideMessageBox = CookieHandler().get('hide-message-box')

    if (isHideMessageBox === 'true') {
      // Skip to show login infromation.
      this.openLoginPageInPopUpWindow()
    } else {
      // Show login infromation.
      super.open()
    }
  }

  // open the login page in a popup window.
  openLoginPageInPopUpWindow() {
    openPopUp(this._loginUrl)
  }

  set hideMessageBox(val) {
    if (val) {
      CookieHandler().set('hide-message-box', 'true', { path: '/' })
    } else {
      CookieHandler().set('hide-message-box', 'false', { path: '/' })
    }
  }
}
