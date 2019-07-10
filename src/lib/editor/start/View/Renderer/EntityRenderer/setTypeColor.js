export default function(label, typeContainer, type) {
    const color = typeContainer.getColor(type), entities = label.nextElementSibling.getElementsByClassName('textae-editor__entity')

    label.setAttribute('style', `background-color: ${color}`)

    Array.prototype.forEach.call(entities, (entity) => {
        entity.setAttribute('style', `border-color: ${color}`)
    })
}
