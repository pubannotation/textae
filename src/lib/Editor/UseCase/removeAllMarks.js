export default function removeAllMarks(htmlElement) {
  for (const element of htmlElement.querySelectorAll('mark')) {
    const parent = element.parentNode
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element)
    }
    parent.removeChild(element)
    parent.normalize()
  }
}
