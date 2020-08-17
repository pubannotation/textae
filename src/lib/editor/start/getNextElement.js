export { getLeftElement, getRightElement }

function getLeftElement(editorDom, element, className) {
  console.assert(element, 'element MUST exists.')

  const [all, index] = getElements(editorDom, element, className)

  if (index > 0) {
    return all[index - 1]
  }

  return null
}

function getRightElement(editorDom, element, className) {
  console.assert(element, 'element MUST exists.')

  const [all, index] = getElements(editorDom, element, className)

  if (all.length - index > 1) {
    return all[index + 1]
  }

  return null
}

function getElements(editorDom, element, className) {
  const all = editorDom.querySelectorAll(`.${className}`)
  const index = Array.from(all).indexOf(element)

  return [all, index]
}
