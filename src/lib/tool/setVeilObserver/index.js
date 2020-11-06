import hasWaitingEditor from './hasWaitingEditor'
import switchVeil from './switchVeil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default function (editorDom) {
  new MutationObserver(updateVeil).observe(editorDom, config)
}

function updateVeil(mutationRecords) {
  mutationRecords.forEach((m) => switchVeil(hasWaitingEditor(m.target)))
}
