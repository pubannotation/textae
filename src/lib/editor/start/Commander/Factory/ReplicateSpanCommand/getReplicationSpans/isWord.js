// The preceding charactor and the following of a word charactor are delimiter.
// For example, 't' ,a part of 'that', is not same with an origin span when it is 't'.
export default function(sourceDoc, detectBoundaryFunc, candidateSpan) {
  const precedingChar = sourceDoc.charAt(candidateSpan.begin - 1)
  const followingChar = sourceDoc.charAt(candidateSpan.end)

  return detectBoundaryFunc(precedingChar) && detectBoundaryFunc(followingChar)
}
