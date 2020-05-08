import LoginInfoDialog from './LoginInfoDialog'
import isSeverAuthRequired from './isSeverAuthRequired'

export default function(ajaxResponse, errorHandler) {
  const location = isSeverAuthRequired(ajaxResponse)

  if (location) {
    new LoginInfoDialog(location).open()
  } else {
    errorHandler()
  }
}
