import isEmptyString from '../../../util/isEmptyString'
import requestAjax from './requestAjax'

export default function(
  url,
  data,
  beforeSend,
  successHandler,
  failHandler,
  finishHandler
) {
  if (isEmptyString(url)) {
    return
  }
  beforeSend()
  console.log('POST data', data)
  requestAjax('post', url, data, successHandler, failHandler, finishHandler)
}
