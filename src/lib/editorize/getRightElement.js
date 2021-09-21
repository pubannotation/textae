export default function (editorHTMLElement, element, className) {
  console.assert(element, 'element MUST exists.')

  const all = editorHTMLElement.querySelectorAll(`.${className}`)
  const index = Array.from(all).indexOf(element)

  if (all.length - index > 1) {
    return all[index + 1]
  }

  return null
}
