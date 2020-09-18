import getOffset from './getOffset'

export default function(editor, span) {
  if (span.parent.id) {
    const { start, end } = getOffset(span, span.parent.begin)

    return {
      textNode: span.parent.element.firstChild,
      start,
      end
    }
  } else {
    const { start, end } = getOffset(span, 0)

    return {
      textNode: editor[0].querySelector(`.textae-editor__body__text-box`)
        .firstChild,
      start,
      end
    }
  }
}
