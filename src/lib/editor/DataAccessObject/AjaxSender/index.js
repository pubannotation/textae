import post from './post'
import patch from './patch'

export default class AjaxSender {
  constructor(beforeSend, failHandler, finishHandler) {
    this.beforeSend = beforeSend
    this.failHandler = failHandler
    this.finishHandler = finishHandler
  }

  post(url, data, successHandler) {
    post(
      url,
      data,
      this.beforeSend,
      successHandler,
      this.failHandler,
      this.finishHandler
    )
  }

  patch(url, data, successHandler) {
    patch(
      url,
      data,
      this.beforeSend,
      successHandler,
      this.failHandler,
      this.finishHandler
    )
  }
}
