import throttle from 'throttleit'

// Observe window-resize event and redraw all editors.
export default function(editors) {
  // Bind resize event
  window.addEventListener(
    'resize',
    throttle(() => editors.redraw(), 500)
  )
}
