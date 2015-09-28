module.exports = function(targets, translater, source) {
  if (source) {
    source = source.map(translater)
  }

  targets.forEach(function(target) {
    target.addSource(source)
  })
}
