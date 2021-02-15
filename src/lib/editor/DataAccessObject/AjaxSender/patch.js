import post from './post'
import requestAjax from './requestAjax'

export default function (
  url,
  data,
  beforeSend,
  successHandler,
  failHandler,
  finishHandler
) {
  console.assert(url, 'url is necessary!')

  const retryByPost = () =>
    post(url, data, beforeSend, successHandler, failHandler, finishHandler)

  beforeSend()
  console.log('PATCH data', data)
  requestAjax('patch', url, data, successHandler, retryByPost, finishHandler)
}
