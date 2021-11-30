import delegate from 'delegate'
import Dialog from '../Dialog'
import enableHTMLelment from '../enableHTMLElement'
import Dropzone from 'dropzone'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'
import isJSON from '../../editorize/start/PersistenceInterface/isJSON'
import maximizeOverlay from './maximizeOverlay'
import revertMaximizeOverlay from './revertMaximizeOverlay'

function template(context) {
  const { url } = context

  return `
<div class="textae-editor__load-dialog__container">
  <div class="textae-editor__load-dialog__row">
    <label>
      URL
    </label>
    <input 
      type="text" 
      value="${url}" 
      class="textae-editor__load-dialog__url-text">
    <input 
      type="button" 
      class="textae-editor__load-dialog__url-button"
      ${url ? `` : `disabled="disabled"`}
      value="Open">
  </div>
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
  <div class="textae-editor__load-dialog__row json">
    <label>
      JSON
    </label>
    <textarea class="textae-editor__load-dialog__textarea"></textarea>
    <input type="button" value="Edit" class="edit" disabled="disabled">
    <input type="button" value="Open" class="instant" disabled="disabled">
  </div>
</div>`
}

const CONFIRM_DISCARD_CHANGE_MESSAGE =
  'There is a change that has not been saved. If you procceed now, you will lose it.'

export default class LoadDialog extends Dialog {
  constructor(
    title,
    url,
    loadFromServer,
    readFromFile,
    readFromText,
    hasChange
  ) {
    super(title, template({ url }), 'Cancel')

    // Disabled the button to load from the URL when no URL.
    delegate(
      super.el,
      '.textae-editor__load-dialog__url-text',
      'input',
      (e) => {
        enableHTMLelment(e.target.nextElementSibling, e.target.value)
      }
    )

    delegate(
      super.el,
      '.textae-editor__load-dialog__textarea',
      'input',
      (e) => {
        enableHTMLelment(
          super.el.querySelector('[type="button"].instant'),
          e.target.value
        )
        enableHTMLelment(
          super.el.querySelector('[type="button"].edit'),
          e.target.value
        )
      }
    )

    const isUserConfirm = () =>
      !hasChange || window.confirm(CONFIRM_DISCARD_CHANGE_MESSAGE)

    // Load from the URL.
    delegate(
      super.el,
      '.textae-editor__load-dialog__url-button',
      'click',
      (e) => {
        if (isUserConfirm()) {
          loadFromServer(e.target.previousElementSibling.value)
        }
        super.close()
      }
    )

    // Load from a file.
    delegate(
      super.el,
      '.textae-editor__load-dialog__local-button',
      'click',
      () => {
        if (isUserConfirm()) {
          readFromFile(this._droppedFile)
        }

        super.close()
      }
    )

    // Load from a textarea
    delegate(super.el, '[type="button"].instant', 'click', () => {
      const text = super.el.querySelector(
        '.textae-editor__load-dialog__textarea'
      ).value
      if (isUserConfirm()) {
        readFromText(text)
      }

      super.close()
    })

    // Open JSON editor
    delegate(super.el, '[type="button"].edit', 'click', () => {
      this._expandDialog()
      const textarea = super.el.querySelector(
        '.textae-editor__load-dialog__textarea'
      )
      if (isJSON(textarea.value)) {
        textarea.value = JSON.stringify(JSON.parse(textarea.value), null, 2)
      }
      this._createJSONEditor(textarea)
    })
  }

  open() {
    super.open()

    const dropzoneConfig = {
      url: 'nothing', //Because it's a setting that cannot be omitted.
      previewsContainer: '.textae-editor__load-dialog__dz-file-preview',
      previewTemplate: super.el.querySelector(
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
        this._showFilePreview(file)
      })

    const dialogDropzone = new Dropzone(
      '.textae-editor__load-dialog__dropzone',
      dropzoneConfig
    )
    dialogDropzone.on('addedfile', (file) => {
      this._showFilePreview(file)
    })
  }

  _showFilePreview(file) {
    // Remove the previous file name.
    super.el
      .querySelector('.textae-editor__load-dialog__dz-file-preview')
      .firstElementChild.remove()

    // Add file name to title attrribute to show tooltip.
    super.el
      .querySelector('.textae-editor__load-dialog__dz-file-preview > div')
      .setAttribute('title', file.name)

    // Enables the button to open the file.
    this._droppedFile = file
    enableHTMLelment(
      super.el.querySelector('.textae-editor__load-dialog__local-button'),
      true
    )
  }

  _expandDialog() {
    super.el
      .closest('.textae-editor__dialog')
      .classList.add('textae-editor__load-dialog--expanded')
  }

  _createJSONEditor(textarea) {
    const JSONEditor = CodeMirror.fromTextArea(textarea, {
      mode: {
        name: 'javascript',
        json: true
      },
      lineNumbers: true,
      value: textarea.value
    })
    const dialogHeight = super.el.closest('.textae-editor__dialog').clientHeight
    JSONEditor.setSize('auto', dialogHeight * 0.6)
    JSONEditor.on('change', (cm) => {
      textarea.value = cm.getValue()
    })
  }
}
