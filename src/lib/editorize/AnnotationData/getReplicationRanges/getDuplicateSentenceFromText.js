export default function (text, beginOfSentence, endOfSentence) {
  const searchSentence = text.substring(beginOfSentence, endOfSentence)
  const sentenceLength = endOfSentence - beginOfSentence
  const findRanges = []

  let end = 0

  for (
    let begin = text.indexOf(searchSentence);
    begin !== -1;
    begin = text.indexOf(searchSentence, end)
  ) {
    end = begin + sentenceLength

    findRanges.push({
      begin,
      end
    })
  }

  return findRanges
}
