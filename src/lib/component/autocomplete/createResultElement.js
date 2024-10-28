export default function createResultElement(item, i) {
  const resultElement = document.createElement('li')
  Object.assign(resultElement.dataset, {
    id: item.id,
    label: item.label,
    index: i
  })

  resultElement.classList.add('textae-editor__dialog__autocomplete__item')
  resultElement.textContent = `${item.label} ${item.id}`
  return resultElement
}
