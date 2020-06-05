import makeTypePrefix from './makeTypePrefix'
import makeId from './makeId'

export default {
  // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
  makeSpanId(editor, span) {
    const spanPrefix = makeTypePrefix(editor.editorId, 'S')
    return `${spanPrefix}${span.begin}_${span.end}`
  },
  makeEntityDomId(editor, id) {
    // Exclude : and . from a dom id to use for ID selector.
    return makeId(editor.editorId, 'E', id.replace(/[:¥.]/g, ''))
  }
}
