import makeTypePrefix from './makeTypePrefix'

export default function(editorId, prefix, id) {
  return makeTypePrefix(editorId, prefix) + id
}
