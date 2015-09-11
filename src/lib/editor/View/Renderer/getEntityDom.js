import idFactory from '../../idFactory'

export default function(entityId, editor) {
  return $(document.querySelector(`#${idFactory.makeEntityDomId(editor, entityId)}`))
}
