import toDomElement from '../../../../../../toDomEelement'
import getDialog from './getDialog'
import bind from './bind'

const html = `
<div class="textae-editor__login-info-dialog">
  <div class="textae-editor__login-info-dialog__message">
    <p>Login is required to proceed. Please open the following link for login. (You need to allow popup window in your browser.)</p>
  </div>
  <div class="textae-editor__login-info-dialog__open-link">
    <input type="button" class="open-link ui-button ui-corner-all ui-widget" value="Login">
  </div>
  <div class="textae-editor__login-info-dialog__message">
    <p>After login, please try to save it again.</p>
  </div>
  <div class="textae-editor__login-info-dialog__ok">
    <input type="button" class="ok ui-button ui-corner-all ui-widget" value="OK">
  </div>
  <div class="textae-editor__login-info-dialog__message-box-setting">
    <input type="checkbox" id="message-box-setting" class="message-box-setting">
    <label for="message-box-setting">Don't show this message again.</label>
  </div>
</div>
`

export default function(loginUrl) {
  const el = toDomElement(html)
  const $dialog = getDialog(el)

  bind(el, $dialog, loginUrl)

  return $dialog
}
