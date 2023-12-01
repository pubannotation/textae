import skipCharacters from '../skipCharacters'
import getNext from './getNext'

export default function (str, position, isWordEdge) {
  return skipCharacters(getNext, -1, str, position, isWordEdge)
}
