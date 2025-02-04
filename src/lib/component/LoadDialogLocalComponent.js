import delegate from 'delegate'
import Dropzone from 'dropzone'
import enableHTMLelment from './enableHTMLElement'
import maximizeOverlay from './maximizeOverlay'
import revertMaximizeOverlay from './revertMaximizeOverlay'

export default class LoadDialogLocalComponent {
  #droppedFile

  get template() {
    return `
<div class="textae-editor__load-dialog__row">
  <label>
    Local
  </label>
  <form class="dropzone textae-editor__load-dialog__dropzone">
    <div class="dz-message">
      Drop a file here or click to select
    </div>
  </form>
  <div class="textae-editor__load-dialog__dz-file-preview">
    <div class="dz-filename"><span data-dz-name>No file selected</span></div>
  </div>
  <input
    type="button"
    class="textae-editor__load-dialog__local-button"
    disabled="disabled"
    value="Open">
</div>
`
  }

  bind(element, onOpen) {
    // Load from a file.
    delegate(
      element,
      '.textae-editor__load-dialog__local-button',
      'click',
      () => onOpen(this.#droppedFile)
    )
  }

  intiializeDropzone(element) {
    const dropzoneConfig = {
      url: 'nothing', //Because it's a setting that cannot be omitted.
      previewsContainer: '.textae-editor__load-dialog__dz-file-preview',
      previewTemplate: element.querySelector(
        '.textae-editor__load-dialog__dz-file-preview'
      ).innerHTML
    }

    const overlayDropzone = new Dropzone(
      'body > div.ui-widget-overlay.ui-front',
      {
        ...dropzoneConfig,
        clickable: false
      }
    )
    const zIndexOfOverlayDropzone = overlayDropzone.element.style.zIndex

    overlayDropzone
      .on('dragenter', () => maximizeOverlay(overlayDropzone))
      .on('dragleave', () =>
        revertMaximizeOverlay(overlayDropzone, zIndexOfOverlayDropzone)
      )
      .on('addedfile', (file) => {
        revertMaximizeOverlay(overlayDropzone, zIndexOfOverlayDropzone)
        this.#showFilePreview(element, file)
      })

    const dialogDropzone = new Dropzone(
      '.textae-editor__load-dialog__dropzone',
      dropzoneConfig
    )
    dialogDropzone.on('addedfile', (file) => {
      this.#showFilePreview(element, file)
    })
  }

  #showFilePreview(element, file) {
    // Remove the previous file name.
    element
      .querySelector('.textae-editor__load-dialog__dz-file-preview')
      .firstElementChild.remove()

    // Add file name to title attrribute to show tooltip.
    element
      .querySelector('.textae-editor__load-dialog__dz-file-preview > div')
      .setAttribute('title', file.name)

    // Enables the button to open the file.
    this.#droppedFile = file
    enableHTMLelment(
      element.querySelector('.textae-editor__load-dialog__local-button'),
      true
    )
  }
}
