import skipCharacters from './skipCharacters'
import getPrev from './getPrev'

export default function(str, position, isWordEdge) {
  return skipCharacters(getPrev, 1, str, position, isWordEdge)
}
