import idFactory from '../../../../../idFactory'
import makeSpanExtension from './makeSpanExtension'

export default function(editor, emitter, paragraph, span) {
  return Object.assign({}, span, {
    id: idFactory.makeSpanId(editor, span),
    paragraph: paragraph.getBelongingTo(span),
  }, makeSpanExtension(emitter))
}
