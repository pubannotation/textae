export default function (e) {
  e.target
    .closest('.textae-editor__type-pallet__content')
    .classList.remove('textae-editor__type-pallet__content--dragging')
}
