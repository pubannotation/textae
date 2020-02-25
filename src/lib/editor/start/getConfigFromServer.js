import ajaxAccessor from '../../util/ajaxAccessor'

export default function(configUrl, done) {
  if (typeof configUrl === 'string') {
    ajaxAccessor(
      configUrl,
      (configFromServer) => done(configFromServer),
      () =>
        alert(
          `could not read the span configuration from the location you specified.: ${configUrl}`
        )
    )
  } else {
    done()
  }
}
