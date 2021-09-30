export default function (e) {
  e.target
    .closest('.textae-editor__pallet__content')
    .classList.remove('textae-editor__pallet__content--dragging')
}
