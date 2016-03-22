const veilClass = 'textae-editor-veil'

function show() {
  const veil = document.querySelector(`.${veilClass}`)

  if (veil) {
    veil.style.display = 'block'
  } else {
    const veil = document.createElement('div')
    veil.className = veilClass
    document.body.appendChild(veil)
  }
}

function hide() {
  const veil = document.querySelector(`.${veilClass}`)

  if (veil) {
    veil.style.display = 'none'
  }
}

export default {
  show,
  hide
}
