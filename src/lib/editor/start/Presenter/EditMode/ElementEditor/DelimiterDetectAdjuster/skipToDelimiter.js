import skipCharacters from '../skipCharacters'
import getNext from './getNext'

export default function skipToDelimiter(str, position, isDelimiter) {
  return skipCharacters(getNext, 1, str, position, (chars) => {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    // Return false to stop an infinite loop when the character undefined.
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
  })
}
