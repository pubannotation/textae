export default function (isBlankCharacter, isDelimiter, chars) {
  // The word is (no charactor || blank || delimiter)(!delimiter).
  return (
    (chars[0] !== '' &&
      !isBlankCharacter(chars[1]) &&
      !isDelimiter(chars[1])) ||
    isDelimiter(chars[0])
  )
}
