import { makeEntityHtmlelementId } from '../../idFactory'

export default function (editor, entityId) {
  const id = makeEntityHtmlelementId(editor, entityId)
  return editor[0].querySelector(`#${id} .textae-editor__entity__endpoint`)
}
