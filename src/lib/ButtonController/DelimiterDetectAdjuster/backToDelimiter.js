import skipCharacters from '../../editor/start/Presenter/EditMode/skipCharacters'
import getPrev from './getPrev'

export default function (str, position, isDelimiter) {
  return skipCharacters(getPrev, -1, str, position, (chars) => {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
  })
}
