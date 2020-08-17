export default function(editorDom, element, className) {
  console.assert(element, 'element MUST exists.')

  const all = editorDom.querySelectorAll(`.${className}`)
  const index = Array.from(all).indexOf(element)

  if (all.length - index > 1) {
    return all[index + 1]
  }

  return null
}
