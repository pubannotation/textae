export default function(targets, translater, source) {
  if (source) {
    source = source.map(translater)
  }

  targets.forEach((target) => {
    target.addSource(source)
  })
}
