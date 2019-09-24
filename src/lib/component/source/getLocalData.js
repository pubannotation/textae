export default function(typeDefinition, term) {
  return [...typeDefinition.definedTypes.values()]
    .filter((t) => t.label)
    .filter((t) => t.label.includes(term))
    .map((raw) => {
      return {
        label: `${raw.label}@${raw.id}`,
        raw
      }
    })
}
