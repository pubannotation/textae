import dohtml from 'dohtml'

export default function (parentElement, id) {
  const div = dohtml.create(`
    <div id="${id}" class="textae-editor__block-bg"></div>
  `)

  // Always add to the top of the annotation box to place it behind the grid.
  parentElement.insertAdjacentElement('afterbegin', div)
}
