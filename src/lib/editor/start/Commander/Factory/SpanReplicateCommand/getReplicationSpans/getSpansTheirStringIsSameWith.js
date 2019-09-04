// Get spans their stirng is same with the originSpan from sourceDoc.
export default function(sourceDoc, originSpan) {
  const getNextStringIndex = String.prototype.indexOf.bind(
    sourceDoc,
    sourceDoc.substring(originSpan.begin, originSpan.end)
  )
  const length = originSpan.end - originSpan.begin
  const findStrings = []

  let offset = 0

  for (
    let index = getNextStringIndex(offset);
    index !== -1;
    index = getNextStringIndex(offset)
  ) {
    findStrings.push({
      begin: index,
      end: index + length
    })
    offset = index + length
  }

  return findStrings
}
