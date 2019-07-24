import idFactory from '../../../../../../idFactory'

export default function(editor, spanContainer, span, maybeParent) {
  if (!maybeParent) {
    return false
  }

  const id = idFactory.makeSpanId(editor, maybeParent)

  if (!spanContainer.get(id)) {
    throw new Error(`maybeParent is removed. ${maybeParent.toStringOnlyThis()}`)
  }

  return maybeParent.begin <= span.begin && span.end <= maybeParent.end
}
