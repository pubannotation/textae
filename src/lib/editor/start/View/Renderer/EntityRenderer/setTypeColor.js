export default function(label, typeContainer, type) {
    const color = typeContainer.getColor(type)
    label.setAttribute('style', `background-color: ${color}`)
}
