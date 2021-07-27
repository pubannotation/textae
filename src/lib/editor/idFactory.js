// The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
export function makeDenotationSpanHTMLElementID(editor, begin, end) {
  return `${editor.editorId}__S${begin}_${end}`
}

export function makeBlockSpanHTMLElementID(editor, begin, end) {
  return `${editor.editorId}__B${begin}_${end}`
}

// Exclude : and . from a dom id to use for ID selector.
export function makeEntityHTMLElementId(editor, id) {
  return `${editor.editorId}__E${id.replace(/[:¥.]/g, '')}`
}
