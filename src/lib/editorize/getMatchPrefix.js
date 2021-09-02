export default function (namespace, type) {
  const namespaces = namespace.all
  const matchs = namespaces
    .filter((namespace) => namespace.prefix !== '_base')
    .filter((namespace) => {
      return type.indexOf(`${namespace.prefix}:`) === 0
    })
  if (matchs.length === 1) return matchs[0]
  return null
}
