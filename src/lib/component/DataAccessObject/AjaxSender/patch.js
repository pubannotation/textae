import isEmptyString from '../../../util/isEmptyString'
import post from './post'
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
  const retryByPost = () =>
    post(url, data, beforeSend, successHandler, failHandler, finishHandler)

  beforeSend()
  console.log('PATCH data', data)
  requestAjax('patch', url, data, successHandler, retryByPost, finishHandler)
}
