export default function (targets, translater, source, type) {
  if (source) {
    source = source.map(translater)
  }

  for (const target of targets) {
    target.addSource(source, type)
  }
}
