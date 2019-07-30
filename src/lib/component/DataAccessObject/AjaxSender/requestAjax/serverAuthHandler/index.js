import cookieHandler from '../../../../../util/CookieHandler'
import loginInfoDialog from './loginInfoDialog'
import openPopUp from './openPopUp'
import isSeverAuthRequired from './isSeverAuthRequired'

export default function(ajaxResponse, errorHandler) {
  const location = isSeverAuthRequired(ajaxResponse)

  if (location) {
    const isHideMessageBox = cookieHandler().get('hide-message-box')
    if (isHideMessageBox === '' || isHideMessageBox === 'false') {
      const dialog = loginInfoDialog(location)
      dialog.open()
    } else {
      openPopUp(location)
    }
  } else {
    errorHandler()
  }
}
