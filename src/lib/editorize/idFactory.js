// The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
export function makeDenotationSpanHTMLElementID(editorID, begin, end) {
  return `${editorID}__S${begin}_${end}`
}

export function makeBlockSpanHTMLElementID(editorID, begin, end) {
  return `${editorID}__B${begin}_${end}`
}
