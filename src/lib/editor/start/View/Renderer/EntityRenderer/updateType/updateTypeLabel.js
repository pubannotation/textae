import getLabelTag from '../../getLabelTag'

export default function(namespace, typeContainer, type) {
  const labelDom = document.querySelector(
    `#${type.id} .textae-editor__type-label`
  )
  const label = getLabelTag(namespace, typeContainer, type.name)

  labelDom.innerHTML = label
}
