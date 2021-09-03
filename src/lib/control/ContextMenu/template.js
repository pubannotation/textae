import isTouchDevice from '../../isTouchDevice'
import toContextMenuItem from './toContextMenuItem'

// Make a group of buttons that is headed by the separator.
export default function (context) {
  return `
<div class="textae-control ${
    isTouchDevice() ? 'textae-android-context-menu' : 'textae-context-menu'
  }">
  ${context
    .map((list) => list.map(toContextMenuItem).join(''))
    .join('<p class="textae-control-separator"></p>\n')}
</div>
`
}
