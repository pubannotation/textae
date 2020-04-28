import idFactory from '../../idFactory'
import ModelContainer from './ModelContainer'

export default class extends ModelContainer {
  constructor(editor, emitter) {
    super(emitter, 'paragraph', (sourceDoc) =>
      mappingFunction(editor, sourceDoc)
    )
  }

  // get the paragraph that span is belong to.
  getBelongingTo(span) {
    const match = super.all.filter(
      (p) => span.begin >= p.begin && span.end <= p.end
    )

    if (match.length === 0) {
      throw new Error('span should belong to any paragraph.')
    } else {
      return match[0]
    }
  }

  get all() {
    const paragraphs = super.all

    // The order is important to render.
    paragraphs.sort((a, b) => {
      if (a.order < b.order) {
        return -1
      }

      if (a.order > b.order) {
        return 1
      }

      return 0
    })

    return paragraphs
  }
}

function mappingFunction(editor, sourceDoc) {
  sourceDoc = sourceDoc || []
  let textLengthBeforeThisParagraph = 0

  return sourceDoc.split('\n').map((p, index) => {
    const ret = {
      id: idFactory.makeParagraphId(editor, index),
      begin: textLengthBeforeThisParagraph,
      end: textLengthBeforeThisParagraph + p.length,
      text: p,
      order: index
    }

    textLengthBeforeThisParagraph += p.length + 1
    return ret
  })
}
