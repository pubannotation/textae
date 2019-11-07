export default function(typeDefinition, term) {
  return typeDefinition.definedTypes.labelIncludes(term).map((raw) => {
    return {
      label: `${raw.label}@${raw.id}`,
      raw
    }
  })
}
