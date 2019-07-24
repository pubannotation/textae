export default function(values, typeDefinition, type) {
  const color = typeDefinition.getColor(type)
  values.setAttribute('style', `background-color: ${color}`)
}
