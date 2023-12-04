// The preceding charactor and the following of a word charactor are delimiter.
// For example, 't' ,a part of 'that', is not same with an origin span when it is 't'.
export default function (sourceDoc, begin, end, isDelimiterFunc) {
  const precedingChar = sourceDoc.charAt(begin - 1)
  const followingChar = sourceDoc.charAt(end)

  return isDelimiterFunc(precedingChar) && isDelimiterFunc(followingChar)
}
