export default function (key = 'name') {
  return (hash, element) => {
    hash[element[key]] = element
    return hash
  }
}
