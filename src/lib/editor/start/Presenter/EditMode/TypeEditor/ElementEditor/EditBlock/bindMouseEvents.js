import delegate from 'delegate'

export default function (editor, mouseEventHandler) {
  const listeners = []

  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
      if (e.target.classList.contains('textae-editor__body__text-box')) {
        mouseEventHandler.textBoxClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', () =>
      mouseEventHandler.entityClicked()
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
