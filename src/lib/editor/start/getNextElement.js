export { getLeftElement, getRightElement }

function getLeftElement(editorDom, element, className) {
  console.assert(element, 'element MUST exists.')

  const all = editorDom.querySelectorAll(`.${className}`)
  const index = [...all].indexOf(element)

  if (index > 0) {
    return all[index - 1]
  }

  return null
}

function getRightElement(editorDom, element, className) {
  console.assert(element, 'element MUST exists.')

  const all = editorDom.querySelectorAll(`.${className}`)
  const index = Array.from(all).indexOf(element)

  if (all.length - index > 1) {
    return all[index + 1]
  }

  return null
}
