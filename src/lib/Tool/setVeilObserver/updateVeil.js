import dohtml from 'dohtml'

// Since not all editors will be notified at once, keep the state in a module scope variable.
const waitingEditors = new Map()
const veilClass = 'textae-editor-veil'

export default function (mutationRecords) {
  mutationRecords.forEach(({ target: element }) => {
    if (element.classList.contains('textae-editor--wait')) {
      waitingEditors.set(element)
    } else {
      waitingEditors.delete(element)
    }
  })

  if (waitingEditors.size > 0) {
    const veil = document.querySelector(`.${veilClass}`)

    if (veil) {
      veil.style.display = 'block'
    } else {
      document.body.appendChild(
        dohtml.create(`<div class="${veilClass}"></div>`)
      )
    }
  } else {
    const veil = document.querySelector(`.${veilClass}`)

    if (veil) {
      veil.style.display = 'none'
    }
  }
}
