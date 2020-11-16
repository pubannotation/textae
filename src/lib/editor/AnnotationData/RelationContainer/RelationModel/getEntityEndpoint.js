import { makeEntityHTMLElementId } from '../../../idFactory'

export default function (editor, entityId) {
  const id = makeEntityHTMLElementId(editor, entityId)
  return editor[0].querySelector(`#${id} .textae-editor__entity__type-values`)
}
