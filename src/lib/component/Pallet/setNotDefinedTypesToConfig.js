export default function(typeContainer) {
  const allIds = typeContainer.getSortedIds()
  const definedIds = typeContainer.getDefinedTypes().map((type) => type.id)
  const notDefinedIds = allIds.filter((id) => !definedIds.includes(id))

  notDefinedIds.map((id) => {
    typeContainer.setDefinedType({id})
  })
}
