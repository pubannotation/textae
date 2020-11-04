export default function (key = 'name') {
  return function (hash, element) {
    hash[element[key]] = element
    return hash
  }
}
