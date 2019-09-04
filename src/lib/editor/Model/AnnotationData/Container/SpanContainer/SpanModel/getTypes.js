export default function(entities) {
  return [
    ...entities
      .map((e) => e.type)
      .reduce((map, type) => map.set(type.id, type), new Map())
      .values()
  ]
}
