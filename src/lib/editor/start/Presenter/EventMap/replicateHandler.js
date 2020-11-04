import getIsDelimiterFunc from '../getIsDelimiterFunc'

export default function (commander, buttonController, spanConfig, span) {
  const isDelimiterFunc = getIsDelimiterFunc(buttonController, spanConfig)

  if (span) {
    commander.invoke(
      commander.factory.replicateSpanCommand(
        span,
        span.entities.map((e) => e.typeValues),
        isDelimiterFunc
      )
    )
  } else {
    alert('You can replicate span annotation when there is only span selected.')
  }
}
