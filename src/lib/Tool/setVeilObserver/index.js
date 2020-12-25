import dohtml from 'dohtml'

// Since not all editors will be notified at once, keep the state in a module scope variable.
const waitingEditors = new Set()
const veilClass = 'textae-editor-veil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default function (editor) {
  new MutationObserver((mutationRecords) => {
    mutationRecords.forEach(({ target: element }) => {
      if (element.classList.contains('textae-editor--wait')) {
        waitingEditors.add(element)
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
  }).observe(editor[0], config)
}
