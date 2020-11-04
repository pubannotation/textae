import { makeEntityDomId } from '../../idFactory'

export default function (editor, entityId) {
  const id = makeEntityDomId(editor, entityId)
  return editor[0].querySelector(`#${id} .textae-editor__entity__endpoint`)
}
