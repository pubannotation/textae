import dohtml from 'dohtml'

export default function (annotationType) {
  const html = `<div class="textae-editor__type-pallet textae-editor__type-pallet--${annotationType}"></div>`
  return dohtml.create(html)
}
