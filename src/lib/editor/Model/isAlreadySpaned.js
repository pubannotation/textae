module.exports = function(allSpans, candidateSpan) {
  return allSpans.filter(function(existSpan) {
    return existSpan.begin === candidateSpan.begin &&
      existSpan.end === candidateSpan.end
  }).length > 0
}
