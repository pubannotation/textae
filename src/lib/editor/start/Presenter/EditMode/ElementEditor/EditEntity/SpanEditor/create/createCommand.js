export default function (commander, newSpan, isReplicateAuto, isDelimiterFunc) {
  return commander.factory.createSpanAndAutoReplicateCommand(
    {
      begin: newSpan.begin,
      end: newSpan.end
    },
    isReplicateAuto,
    isDelimiterFunc
  )
}
