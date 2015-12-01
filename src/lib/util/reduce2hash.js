export default function(key) {
  if (!key) {
    key = 'name'
  }

  return function(hash, element) {
    hash[element[key]] = element
    return hash
  }
}
