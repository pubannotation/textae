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

  return listeners
}
