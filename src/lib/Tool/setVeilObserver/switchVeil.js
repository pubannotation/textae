import dohtml from 'dohtml'

export default function (hasWaitingEditor) {
  if (hasWaitingEditor) {
    show()
  } else {
    hide()
  }
}

const veilClass = 'textae-editor-veil'

function show() {
  const veil = document.querySelector(`.${veilClass}`)

  if (veil) {
    veil.style.display = 'block'
  } else {
    document.body.appendChild(dohtml.create(`<div class="${veilClass}"></div>`))
  }
}

function hide() {
  const veil = document.querySelector(`.${veilClass}`)

  if (veil) {
    veil.style.display = 'none'
  }
}
