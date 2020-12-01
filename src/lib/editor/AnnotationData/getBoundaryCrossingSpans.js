import isBoundaryCrossing from '../isBoundaryCrossing'

export default function (spans, begin, end) {
  return spans.filter((existSpan) => isBoundaryCrossing(begin, end, existSpan))
}
