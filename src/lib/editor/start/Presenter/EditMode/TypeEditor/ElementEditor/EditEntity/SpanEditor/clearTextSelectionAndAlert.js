import clearTextSelection from '../../clearTextSelection'

export default function (message) {
  // Wait 10 milliseconds to show alert after deselecting text.
  // 10 milliseconds was decided by experimenting with Google Chrome.
  // Changes may be required in your environment.
  clearTextSelection()
  setTimeout(() => alert(message), 10)
}
