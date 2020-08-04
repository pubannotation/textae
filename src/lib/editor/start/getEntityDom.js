import idFactory from '../idFactory'

export default function(editor, entityId) {
  const id = idFactory.makeEntityDomId(editor, entityId)
  return editor[0].querySelector(`#${id}`)
}
