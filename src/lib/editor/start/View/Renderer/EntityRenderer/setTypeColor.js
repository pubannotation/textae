export default function(label, typeDefinition, type) {
    const color = typeDefinition.getColor(type)
    label.setAttribute('style', `background-color: ${color}`)
}
