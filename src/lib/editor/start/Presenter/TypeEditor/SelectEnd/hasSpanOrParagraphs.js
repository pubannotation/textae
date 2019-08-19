import hasSpan from './hasSpan'
import hasParagraphs from './hasParagraphs'

export default function($node) {
  return hasSpan($node) || hasParagraphs($node)
}
