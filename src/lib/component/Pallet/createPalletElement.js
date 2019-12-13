import toDomElement from '../../toDomEelement'

export default function(editModeName) {
  const html = `<div class="textae-editor__type-pallet textae-editor__type-pallet--${editModeName}"></div>`
  return toDomElement(html)
}
