import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'

export default function (editor, pallet, content) {
  // Wrap the content in a special class so that you can determine if the target of the event is an element of the palette
  // even after the content has been removed from the DOM tree.
  // The taxtae-editor deselects itself when a click event to something other than taxtae-editor occurs.
  // After updating the palette, the click event reaches the body.
  // At that time, if the target of the event is the palette, you can see that it is an event for textae-editor.
  pallet.innerHTML = `
    <div class="textae-editor__type-pallet__title"></div>
    <div class="textae-editor__type-pallet__content">${content}</div>
  `
  setWidthWithinWindow(editor, pallet)
  setHeightWithinWindow(pallet)
}
