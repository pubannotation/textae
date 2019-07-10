import * as lineHeight from '../../editor/start/View/lineHeight'
import updateLineHeight from './updateLineHeight'
import $ from 'jquery'
import _ from 'underscore'

const CONTENT = `
  <div class="textae-editor__setting-dialog">
      <div>
          <label class="textae-editor__setting-dialog__label">Type Gap</label>
          <input type="number" class="textae-editor__setting-dialog__type-gap type-gap" step="1" min="0" max="5">
      </div>
      <div>
          <label class="textae-editor__setting-dialog__label">Line Height</label>
          <input type="number" class="textae-editor__setting-dialog__line-height line-height" step="1" min="50" max="500">
          px
      </div>
      <div>
          <label class="textae-editor__setting-dialog__label">Lock Edit Config</label>
          <input type="checkbox" class="textae-editor__setting-dialog__lock-config lock-config">
      </div>
      <div>
            <label class="textae-editor__setting-dialog__label">Reset Hidden Message Boxes</label>
          <input type="button" class="textae-editor__setting-dialog__reset-hidden-message-boxes reset-hidden-message-boxes" value="Reset">
      </div>
  </div>
`

export default function(editor, displayInstance) {
  const $content = $(CONTENT)

  bind($content, editor, displayInstance)

  return $content[0]
}

function bind($content, editor, displayInstance) {
  bindChangeTypeGap(
    $content,
    editor,
    displayInstance
  )

  bindChangeLineHeight(
    $content,
    editor
  )

  bindChangeLockConfig(
    $content,
    editor
  )

  bindClickResetHiddenMessageBoxes(
    $content,
    editor
  )
}

function bindChangeTypeGap($content, editor, displayInstance) {
  const onTypeGapChange = debounce300(
    (e) => {
      displayInstance.changeTypeGap(Number(e.target.value))
      updateLineHeight(editor, $content)
    }
  )

  return $content
    .on(
      'change',
      '.type-gap',
      onTypeGapChange
    )
}

function bindChangeLineHeight($content, editor) {
  const onLineHeightChange = debounce300(
    (e) => {
      lineHeight.set(editor[0], e.target.value)
      redrawAllEditor()
    }
  )

  return $content
    .on(
      'change',
      '.line-height',
      onLineHeightChange
    )
}

function bindChangeLockConfig($content, editor) {
  const onChangeLockConfig = debounce300(
    (e) => {
      if (e.target.checked) {
        editor.eventEmitter.emit('textae.config.lock')
      } else {
        editor.eventEmitter.emit('textae.config.unlock')
      }
    }
  )

  return $content
    .on(
      'change',
      '.lock-config',
      onChangeLockConfig
    )
}

function bindClickResetHiddenMessageBoxes($content, editor) {
  const onClickResetHiddenMessageBoxes = () => {
    editor.eventEmitter.emit('textae.message-box.show')
  }

  return $content.on('click', '.reset-hidden-message-boxes', onClickResetHiddenMessageBoxes)
}

// Redraw all editors in tha windows.
function redrawAllEditor() {
  const event = new Event('resize')
  window.dispatchEvent(event)
}

function debounce300(func) {
  return _.debounce(func, 300)
}
