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
        mouseEventHandler.blockSpanClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__block-bg', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__block-bg')) {
        mouseEventHandler.blockBackgroundClicked(e)
      }
    })
  )

  return listeners
}
