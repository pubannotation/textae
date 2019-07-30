import post from './post'
import patch from './patch'

export default class {
  constructor(beforeSend, successHandler, failHandler, finishHandler) {
    this.beforeSend = beforeSend
    this.successHandler = successHandler
    this.failHandler = failHandler
    this.finishHandler = finishHandler
  }

  post(url, data) {
    post(
      url,
      data,
      this.beforeSend,
      this.successHandler,
      this.failHandler,
      this.finishHandler
    )
  }

  patch(url, data) {
    patch(
      url,
      data,
      this.beforeSend,
      this.successHandler,
      this.failHandler,
      this.finishHandler
    )
  }
}
