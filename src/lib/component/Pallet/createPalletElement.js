import dohtml from 'dohtml'

export default function () {
  // Add ui-dialog class to prohibit the entity edit dialog from taking the focus.
  const html = `
    <div 
      class="textae-editor__pallet ui-dialog"
      style="display: none;"
      >
    </div>`
  return dohtml.create(html)
}
