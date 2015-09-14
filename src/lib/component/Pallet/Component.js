export default function(selectType, selectDefaultType) {
  let $pallet = $('<div>')
    .addClass("textae-editor__type-pallet")
    .append($('<table>'))
    .css('position', 'fixed')

  $pallet
    .on('click', '.textae-editor__type-pallet__entity-type__label', function() {
      $pallet.hide()
      selectType($(this).attr('label'))
    })
    .on('change', '.textae-editor__type-pallet__entity-type__radio', function() {
      $pallet.hide()
      selectDefaultType($(this).attr('label'))
    })
    .hide()

  return $pallet
}
