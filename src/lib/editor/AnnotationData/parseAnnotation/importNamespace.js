import importSource from './importSource'

export default function (destination, source) {
  // Clone source to prevet changing orignal data.
  importSource(
    [destination],
    (namespace) => ({ id: namespace.prefix, ...namespace }),
    source
  )
}
