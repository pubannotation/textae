// The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
export function makeDenotationSpanHTMLElementID(editor, begin, end) {
  return `${editor.editorId}__S${begin}_${end}`
}

export function makeBlockSpanHTMLElementID(editorId, begin, end) {
  return `${editorId}__B${begin}_${end}`
}
