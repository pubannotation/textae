import delegate from 'delegate'
import Dialog from './Dialog'
import enableHTMLelment from './enableHTMLElement'
import Dropzone from 'dropzone'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'
import isJSON from '../editor/start/PersistenceInterface/isJSON'

function template(context) {
  const { url } = context

  return `
<div>
  <div class="textae-editor__load-dialog__row">
    <label class="textae-editor__load-dialog__label">
      URL
    </label>
    <input 
      type="text" 
      value="${url}" 
      class="textae-editor__load-dialog__file-name url expandable">
    <input 
      type="button" 
      class="url" ${url ? `` : `disabled="disabled"`} 
      value="Open">
  </div>
  <div class="textae-editor__load-dialog__row">
    <label class="textae-editor__load-dialog__label">
      Local
    </label>
    <div class="textae-editor__load-dialog__dz-file-preview expandable">
      <div class="dz-filename"><span data-dz-name>No file selected</span></div>
    </div>
    <input 
      type="button" 
      class="local"
      disabled="disabled"
      value="Open">
    <form class="dropzone textae-editor__load-dialog__dropzone expandable">
      <div class="dz-message">
        Drop a file here or click to select
      </div>
    </form>
  </div>
  <div class="textae-editor__load-dialog__row json">
    <label class="textae-editor__load-dialog__label">
      JSON
    </label>
    <textarea class="textae-editor__load-dialog__textarea"></textarea>
    <div>
      <input type="button" value="Edit" class="edit" disabled="disabled">
      <input type="button" value="Open" class="instant" disabled="disabled">
    </div>
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
    delegate(super.el, '[type="text"].url', 'input', (e) => {
      enableHTMLelment(e.target.nextElementSibling, e.target.value)
    })

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
    delegate(super.el, '[type="button"].url', 'click', (e) => {
      if (isUserConfirm()) {
        loadFromServer(e.target.previousElementSibling.value)
      }
      super.close()
    })

    // Load from a file.
    delegate(super.el, '[type="button"].local', 'click', () => {
      if (isUserConfirm()) {
        readFromFile(this.dropedFile)
      }

      super.close()
    })

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
    overlayDropzone.on('addedfile', (file) => {
      this._showFilePreview(file)
    })

    const dialogDropzone = new Dropzone(
      '.textae-editor__load-dialog__dropzone',
      dropzoneConfig
    )
    dialogDropzone.on('addedfile', (file) => {
      this._showFilePreview(file)
    })

    this._preventDropOutsideDropzone()
  }

  _showFilePreview(file) {
    super.el
      .querySelector('.textae-editor__load-dialog__dz-file-preview > div')
      .remove()
    this.dropedFile = file
    super.el
      .querySelector('.textae-editor__load-dialog__dz-file-preview > div')
      .setAttribute('title', this.dropedFile.name)
    enableHTMLelment(super.el.querySelector('[type="button"].local'), true)
  }

  _preventDropOutsideDropzone() {
    const dialog = super.el.closest('.textae-editor__dialog')
    dialog.addEventListener('dragover', (ev) => {
      ev.preventDefault()
    })
    dialog.addEventListener('drop', (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
    })
  }

  _expandDialog() {
    const dialog = super.el.closest('.textae-editor__dialog')
    dialog.classList.add('textae-editor__dialog__expanded')
    const itemsToExpand = super.el.querySelectorAll('.expandable')
    Array.from(itemsToExpand).map((e) => e.classList.add('expanded-item'))
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
    JSONEditor.setSize(null, 400)
    JSONEditor.on('change', (cm) => {
      textarea.value = cm.getValue()
    })
  }
}
