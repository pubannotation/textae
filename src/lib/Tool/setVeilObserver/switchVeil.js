import dohtml from 'dohtml'

const veilClass = 'textae-editor-veil'

export default function (hasWaitingEditor) {
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
