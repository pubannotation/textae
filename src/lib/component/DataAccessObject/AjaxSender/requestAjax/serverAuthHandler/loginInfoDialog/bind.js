import delegate from 'delegate'
import cookieHandler from '../../../../../../util/CookieHandler'
import openPopUp from '../openPopUp'

export default function(el, $dialog, loginUrl) {
  delegate(el, `.open-link`, 'click', () => {
    // open the login page in a popup window.
    openPopUp(loginUrl)
  })
  delegate(el, `.message-box-setting`, 'change', (event) => {
    if (event.target.checked) {
      cookieHandler().set('hide-message-box', 'true', { path: '/' })
    } else {
      cookieHandler().set('hide-message-box', 'false', { path: '/' })
    }
  })
  delegate(el, `.ok`, 'click', () => $dialog.close())
}
