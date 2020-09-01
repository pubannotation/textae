export default function(targets, translater, source) {
  if (source) {
    source = source.map(translater)
  }

  for (const target of targets) {
    target.addSource(source)
  }
}
