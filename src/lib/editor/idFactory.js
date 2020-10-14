export default {
  // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
  makeSpanDomId(editor, begin, end) {
    return `${editor.editorId}__S${begin}_${end}`
  },
  makeEntityDomId(editor, id) {
    // Exclude : and . from a dom id to use for ID selector.
    return `${editor.editorId}__E${id.replace(/[:¥.]/g, '')}`
  }
}
