export default function (destination, source) {
  destination.addSource(
    source.map((namespace) => ({ id: namespace.prefix, ...namespace }))
  )
}
