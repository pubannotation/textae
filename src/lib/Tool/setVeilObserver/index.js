import updateVeil from './updateVeil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

export default function (editor) {
  new MutationObserver(updateVeil).observe(editor[0], config)
}
