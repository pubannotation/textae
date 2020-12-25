import dohtml from 'dohtml'
import hasWaitingEditor from './hasWaitingEditor'

export default function (mutationRecords) {
  mutationRecords.forEach((m) => switchVeil(hasWaitingEditor(m.target)))
}

function switchVeil(hasWaitingEditor) {
  const veilClass = 'textae-editor-veil'
  if (hasWaitingEditor) {
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
