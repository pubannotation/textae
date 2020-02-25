import alertifyjs from 'alertifyjs'
import ajaxAccessor from '../../util/ajaxAccessor'

export default function(configUrl, done) {
  if (typeof configUrl === 'string') {
    ajaxAccessor(
      configUrl,
      (configFromServer) => done(configFromServer),
      () =>
        alertifyjs.error(
          `could not load the configuration from the location you specified.: ${configUrl}`
        )
    )
  } else {
    done()
  }
}
