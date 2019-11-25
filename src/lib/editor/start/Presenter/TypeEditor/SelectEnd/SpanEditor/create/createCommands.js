export default function(
  commander,
  newSpan,
  isReplicateAuto,
  isDetectDelimiterEnable,
  spanConfig
) {
  return commander.factory.createSpanAndAutoReplicateCommand(
    {
      begin: newSpan.begin,
      end: newSpan.end
    },
    isReplicateAuto,
    isDetectDelimiterEnable ? (char) => spanConfig.isDelimiter(char) : null
  )
}
