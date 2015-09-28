module.exports = function(hash, element) {
  hash[element.name] = element
  return hash
}
