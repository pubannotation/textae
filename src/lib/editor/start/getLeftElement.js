export default function(editorDom, element, className) {
  console.assert(element, 'element MUST exists.')

  const all = editorDom.querySelectorAll(`.${className}`)
  const index = [...all].indexOf(element)

  if (index > 0) {
    return all[index - 1]
  }

  return null
}
