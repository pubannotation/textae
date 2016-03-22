import hasWaitingEditor from './hasWaitingEditor'
import veil from './veil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default function(editorDom) {
  new MutationObserver(updateVeil)
    .observe(editorDom, config)
}

function updateVeil(mutationRecords) {
  mutationRecords
    .forEach((m) => switchVeil(hasWaitingEditor(m.target)))
}

function switchVeil(hasWaitingEditor) {
  if (hasWaitingEditor) {
    veil.show()
  } else {
    veil.hide()
  }
}
