export default function (destination, source) {
  // Clone source to prevet changing orignal data.
  importSource(
    [destination],
    (namespace) => ({ id: namespace.prefix, ...namespace }),
    source
  )
}

function importSource(targets, translater, source, type) {
  if (source) {
    source = source.map(translater)
  }

  for (const target of targets) {
    target.addSource(source, type)
  }
}
