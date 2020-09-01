import delegate from 'delegate'

export default function(el, dialog) {
  delegate(el, `.open-link`, 'click', () => dialog.openLoginPageInPopUpWindow())

  delegate(
    el,
    `.message-box-setting`,
    'change',
    (event) => (dialog.hideMessageBox = event.target.checked)
  )

  delegate(el, `.ok`, 'click', () => dialog.close())
}
