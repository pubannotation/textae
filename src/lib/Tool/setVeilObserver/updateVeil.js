import dohtml from 'dohtml'
import hasWaitingEditor from './hasWaitingEditor'

export default function (mutationRecords) {
  mutationRecords.forEach((m) => {
    const veilClass = 'textae-editor-veil'

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
