import cookieHandler from '../../../../../util/CookieHandler'
import LoginInfoDialog from '../../../../LoginInfoDialog'
import openPopUp from './openPopUp'
import isSeverAuthRequired from './isSeverAuthRequired'

export default function(ajaxResponse, errorHandler) {
  const location = isSeverAuthRequired(ajaxResponse)

  if (location) {
    const isHideMessageBox = cookieHandler().get('hide-message-box')
    if (isHideMessageBox === '' || isHideMessageBox === 'false') {
      const dialog = new LoginInfoDialog(location)
      dialog.open()
    } else {
      openPopUp(location)
    }
  } else {
    errorHandler()
  }
}
