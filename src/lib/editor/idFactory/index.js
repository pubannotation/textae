import makeTypePrefix from "./makeTypePrefix"
import makeId from "./makeId"

const typeCounter = []

export default {
  // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
  makeSpanId(editor, span) {
    const spanPrefix = makeTypePrefix(editor.editorId, 'S')
    return `${spanPrefix}${span.begin}_${span.end}`
  },
  // The ID of type has number of type.
  // This IDs are used for id of DOM element and css selector for jQuery.
  // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor.
  makeTypeId(entity) {
    const attrs = entity.attributes.map(a => a.pred + a.obj).join(',')
    const key = String(entity.type) + attrs

    if (typeCounter.indexOf(key) === -1) {
      typeCounter.push(key)
    }

    return `${entity.span}-${typeCounter.indexOf(key)}`
  },
  makeEntityDomId(editor, id) {
    // Exclude : and . from a dom id to use for ID selector.
    return makeId(editor.editorId, 'E', id.replace(/[:¥.]/g, ''))
  },
  makeParagraphId(editor, id) {
    return makeId(editor.editorId, 'P', id)
  }
}
