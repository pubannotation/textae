import updateVeil from './updateVeil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default function (editorDom) {
  new MutationObserver(updateVeil).observe(editorDom, config)
}
