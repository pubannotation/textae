export default function(editor, entityId) {
  return editor.querySelector(`[title="${entityId}"]`)
}
