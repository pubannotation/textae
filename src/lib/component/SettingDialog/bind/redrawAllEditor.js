// Redraw all editors in tha windows.
export default function redrawAllEditor() {
  const event = new Event('resize')
  window.dispatchEvent(event)
}
