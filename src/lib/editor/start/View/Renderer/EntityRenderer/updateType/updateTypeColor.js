export default function(typeDefinition, type) {
  const valuesDom = document.querySelector(
    `#${type.id} .textae-editor__type-values`
  )
  const color = typeDefinition.getColor(type.name)

  valuesDom.setAttribute('style', `background-color: ${color}`)
}
