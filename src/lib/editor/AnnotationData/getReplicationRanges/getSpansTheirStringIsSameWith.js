// Get spans their stirng is same with the originSpan from sourceDoc.
export default function(sourceDoc, begin, end) {
  const getNextStringIndex = String.prototype.indexOf.bind(
    sourceDoc,
    sourceDoc.substring(begin, end)
  )
  const length = end - begin
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
