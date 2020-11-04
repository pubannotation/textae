const waitingEditors = new Map()

export default function (element) {
  if (element.classList.contains('textae-editor--wait')) {
    waitingEditors.set(element)
  } else {
    waitingEditors.delete(element)
  }

  return waitingEditors.size > 0
}
