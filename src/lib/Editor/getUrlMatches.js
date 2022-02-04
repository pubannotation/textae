export default function (type) {
  // The regular-expression to parse URL.
  // See detail:
  // http://someweblog.com/url-regular-expression-javascript-link-shortener/
  const urlRegex =
    /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([/]?[^\s?]*[/]{1})*(?:\/?([^\s\n?[\]{}#]*(?:(?=\.)){1}|[^\s\n?[\]{}.#]*)?([.]{1}[^\s?#]*)?)?(?:\?{1}([^\s\n#[\]]*))?([#][^\s\n]*)?\)?/gi
  return urlRegex.exec(type)
}
