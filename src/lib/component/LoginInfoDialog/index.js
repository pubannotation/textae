import EditorDialog from '../dialog/EditorDialog'
import openPopUp from '../DataAccessObject/openPopUp'
import $ from 'jquery'

const OPEN_LINK_NAME = 'open-link'
const OK_NAME = 'ok'
const MESSAGE_BOX_SETTING_NAME = 'message-box-setting'
const CONTENT = `
    <div class="textae-editor__login-info-dialog">
        <div class="textae-editor__login-info-dialog__message">
            <p>Login is required to proceed. Please open the following link for login. (You need to allow popup window in your browser.)</p>
        </div>
        <div class="textae-editor__login-info-dialog__${OPEN_LINK_NAME}">
            <input type="button" class="${OPEN_LINK_NAME} ui-button ui-corner-all ui-widget" value="Login">
        </div>
        <div class="textae-editor__login-info-dialog__message">
            <p>After login, please try to save it again.</p>
        </div>
        <div class="textae-editor__login-info-dialog__${OK_NAME}">
            <input type="button" class="${OK_NAME} ui-button ui-corner-all ui-widget" value="OK">
        </div>
        <div class="textae-editor__login-info-dialog__${MESSAGE_BOX_SETTING_NAME}">
            <input type="checkbox" id="${MESSAGE_BOX_SETTING_NAME}" class="${MESSAGE_BOX_SETTING_NAME}">
            <label for="${MESSAGE_BOX_SETTING_NAME}">Don't show this message again.</label>
        </div>
    </div>
`

export default function(editor, loginUrl) {
  const $content = $(CONTENT)
  const $dialog = appendToDialog($content[0], editor)
  bind($content, $dialog, loginUrl, editor)

  return $dialog
}

function appendToDialog($content, editor) {
  return new EditorDialog(
    editor.editorId,
    'textae.dialog.login-info',
    'Login is required',
    $content,
    {
      noCancelButton: true
    }
  )
}

function bind($content, $dialog, loginUrl, editor) {
  $content.on('click', `.${OPEN_LINK_NAME}`, () => {
    // open the login page in a popup window.
    openPopUp(loginUrl)
  })

  $content.on('change', `.${MESSAGE_BOX_SETTING_NAME}`, (event) => {
    if (event.target.checked) {
      editor.eventEmitter.emit('textae.message-box.hide')
    } else {
      editor.eventEmitter.emit('textae.message-box.show')
    }
  })

  $content.on('click', `.${OK_NAME}`, () => {
    $dialog.close()
  })
}
