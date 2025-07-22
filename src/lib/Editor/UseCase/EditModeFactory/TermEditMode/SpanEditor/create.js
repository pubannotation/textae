export default function create(
  annotationModel,
  commander,
  textSelectionAdjuster,
  isReplicateAuto,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = annotationModel.getTextSelection(
    spanConfig,
    textSelectionAdjuster
  )

  if (annotationModel.validateNewDenotationSpan(begin, end)) {
    const command = commander.factory.createSpanAndAutoReplicateCommand(
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )
    commander.invoke(command)
  }
}
