export {
  getLeftElement,
  getRightElement
}

function getLeftElement(editorDom, element) {
  console.assert(element, 'element MUST exists.')

  let [all, index] = getElements(editorDom, element)

  if (index > 0) {
    return all[index - 1]
  }
}

function getRightElement(editorDom, element) {
  console.assert(element, 'element MUST exists.')

  let [all, index] = getElements(editorDom, element)

  if (all.length - index > 1) {
    return all[index + 1]
  }
}

function getElements(editorDom, element) {
  let className = Array.from(element.classList)
    .filter(name => name.indexOf('textae-editor__') === 0)[0],
    all = editorDom.querySelectorAll(`.${className}`),
    index = Array.from(all).indexOf(element)

  return [all, index]
}
