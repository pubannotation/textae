import dohtml from 'dohtml'

const waitingEditors = new Map()

function hasWaitingEditor(element) {
  if (element.classList.contains('textae-editor--wait')) {
    waitingEditors.set(element)
  } else {
    waitingEditors.delete(element)
  }

  return waitingEditors.size > 0
}

const veilClass = 'textae-editor-veil'

export default function (mutationRecords) {
  mutationRecords.forEach((m) => {
    if (hasWaitingEditor(m.target)) {
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
  })
}
