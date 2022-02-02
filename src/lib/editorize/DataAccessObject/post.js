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

  beforeSend()
  requestAjax('post', url, data, successHandler, failHandler, finishHandler)
}
