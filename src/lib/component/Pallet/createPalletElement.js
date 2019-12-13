import dohtml from 'dohtml'

export default function(editModeName) {
  const html = `<div class="textae-editor__type-pallet textae-editor__type-pallet--${editModeName}"></div>`
  return dohtml.create(html)
}
