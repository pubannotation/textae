import getPositions from './getPositions'

export default function(annotationData, selection) {
  const [begin, end] = getPositions(annotationData, selection)

  // switch the position when the selection is made from right to left
  if (begin > end) {
    return [end, begin]
  }

  return [begin, end]
}
