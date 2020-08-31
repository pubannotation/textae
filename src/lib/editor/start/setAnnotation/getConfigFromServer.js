import alertifyjs from 'alertifyjs'
import ajaxAccessor from '../../../util/ajaxAccessor'

export default function(configUrl, done) {
  ajaxAccessor(
    configUrl,
    (configFromServer) => done(configFromServer),
    () =>
      alertifyjs.error(
        `Could not load the file from the location you specified.: ${configUrl}`
      )
  )
}
