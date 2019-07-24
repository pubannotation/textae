export { getLeftElement, getRightElement }

function getLeftElement(editorDom, element) {
  console.assert(element, 'element MUST exists.')

  let [all, index] = getElements(editorDom, element)

  if (index > 0) {
    return all[index - 1]
  }

  return null
}

function getRightElement(editorDom, element) {
  console.assert(element, 'element MUST exists.')

  let [all, index] = getElements(editorDom, element)

  if (all.length - index > 1) {
    return all[index + 1]
  }

  return null
}

function getElements(editorDom, element) {
  let className = Array.from(element.classList).filter(
    (name) => name.indexOf('textae-editor__') === 0
  )[0]
  let all = editorDom.querySelectorAll(`.${className}`)
  let index = Array.from(all).indexOf(element)

  return [all, index]
}
