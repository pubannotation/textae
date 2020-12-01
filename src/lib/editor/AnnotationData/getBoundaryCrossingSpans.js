import isBoundaryCrossing from '../isBoundaryCrossing'

export default function (spans, begin, end) {
  return spans.filter(({ span }) => isBoundaryCrossing(begin, end, span))
}
