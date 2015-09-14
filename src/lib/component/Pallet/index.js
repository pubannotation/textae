import Component from './Component'
import Row from './Row'

export default function(selectType, selectDefaultType) {
  let $pallet = new Component(selectType, selectDefaultType)

  return {
    show: (typeContainer, point) => show($pallet, typeContainer, point),
    hide: () => $pallet.hide()
  }
}

function show($pallet, typeContainer, point) {
  if (typeContainer && typeContainer.getSortedNames().length > 0) {
    $pallet = reuseOldPallet($pallet)
    $pallet = appendRows(typeContainer, $pallet)
    $pallet = setMaxHeight($pallet)

    // Move the pallet to mouse.
    $pallet
      .css(point)
      .show()
  }
}

function reuseOldPallet($pallet) {
  let $oldPallet = $('.textae-editor__type-pallet')

  if ($oldPallet.length !== 0) {
    return $oldPallet.find('table').empty().end().css('width', 'auto')
  } else {
    // Append the pallet to body to show on top.
    $("body").append($pallet)
    return $pallet
  }
}

function appendRows(typeContainer, $pallet) {
  return $pallet.find("table")
    .append(new Row(typeContainer))
    .end()
}

function setMaxHeight($pallet) {
  // Show the scrollbar-y if the height of the pallet is same witch max-height.
  if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
    return $pallet.css('overflow-y', 'scroll')
  } else {
    return $pallet.css('overflow-y', '')
  }
}
