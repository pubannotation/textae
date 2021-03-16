import delegate from 'delegate'

export default function (editor, mouseEventHandler) {
  const listeners = []

  listeners.push(
    delegate(editor[0], '.textae-editor__text-box', 'click', (e) => {
      if (e.target.classList.contains('textae-editor__text-box')) {
        mouseEventHandler.textBoxClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor', 'click', (e) => {
      // The delegate also fires events for child elements of the selector.
      // Ignores events that occur in child elements.
      // Otherwise, you cannot select child elements.
      if (e.target.classList.contains('textae-editor')) {
        mouseEventHandler.bodyClicked()
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__signboard', 'click', () =>
      mouseEventHandler.signboardClicked()
    )
  )

  listeners.push(
    delegate(
      editor[0],
      '.textae-editor__signboard__type-values',
      'click',
      (e) => mouseEventHandler.typeValuesClicked(e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__block', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__block')) {
        mouseEventHandler.blockSpanClicked()
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__block-hit-area', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__block-hit-area')) {
        mouseEventHandler.blockHitAreaClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__style', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__style')) {
        mouseEventHandler.styleSpanClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__span', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__span')) {
        mouseEventHandler.denotationSpanClicked(e)
      }
    })
  )

  return listeners
}
