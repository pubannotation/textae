import setWidthWithinWindow from './setWidthWithinWindow'
import setHeightWithinWindow from './setHeightWithinWindow'

export default function (editor, pallet, annotationType, content) {
  // Wrap the content in a special class so that you can determine if the target of the event is an element of the palette
  // even after the content has been removed from the DOM tree.
  // The taxtae-editor deselects itself when a click event to something other than taxtae-editor occurs.
  // After updating the palette, the click event reaches the body.
  // At that time, if the target of the event is the palette, you can see that it is an event for textae-editor.
  pallet.innerHTML = `
    <div class="textae-editor__type-pallet__title ui-widget-header ui-corner-all">
      <span>${
        annotationType.charAt(0).toUpperCase() + annotationType.slice(1)
      } configuration</span>
      <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="Close">
        <span class="ui-button-icon ui-icon ui-icon-closethick"></span>
        <span class="ui-button-icon-space"> </span>Close
      </button>
    </div>
    <div class="textae-editor__type-pallet__content">${content}</div>
  `
  setWidthWithinWindow(editor, pallet)
  setHeightWithinWindow(pallet)
}
