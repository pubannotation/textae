import Dialog from './dialog/Dialog'

export default function() {
  const el = document.createElement('div')
  el.className = 'textae-tool__key-help'

  const helpDialog = new Dialog({
      height: 313,
      width: 523
    }, 'textae-control__help',
    'Help (Keyboard short-cuts)',
    el
  )

  return helpDialog.open
}
