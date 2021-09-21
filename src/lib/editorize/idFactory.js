// The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
export function makeDenotationSpanHTMLElementID(editor, begin, end) {
  return `${editor.editorId}__S${begin}_${end}`
}

export function makeBlockSpanHTMLElementID(editorID, begin, end) {
  return `${editorID}__B${begin}_${end}`
}
