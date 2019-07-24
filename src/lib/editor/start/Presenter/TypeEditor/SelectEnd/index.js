import * as selectionValidator from './selectionValidator'
import SpanEditor from './SpanEditor'
import * as selectPosition from './selectPosition'
import clearTextSelection from '../clearTextSelection'

export default function(
  editor,
  annotationData,
  selectionModel,
  command,
  pushButtons,
  typeDefinition
) {
  // Initiated by events.
  let selectEndOnTextImpl = null
  let selectEndOnSpanImpl = null

  const changeSpanEditorAccordingToButtons = function() {
    const isDetectDelimiterEnable = pushButtons
      .getButton('boundary-detection')
      .value()
    const isReplicateAuto = pushButtons.getButton('replicate-auto').value()
    const spanEditor = new SpanEditor(
      editor,
      annotationData,
      selectionModel,
      command,
      typeDefinition,
      isDetectDelimiterEnable,
      isReplicateAuto
    )

    selectEndOnTextImpl = (annotationData, data) =>
      selectEndOnText(spanEditor, annotationData, data)
    selectEndOnSpanImpl = (annotationData, data) =>
      selectEndOnSpan(spanEditor, annotationData, data)
  }

  // Change spanEditor according to the  buttons state.
  changeSpanEditorAccordingToButtons()

  pushButtons
    .getButton('boundary-detection')
    .on('change', changeSpanEditorAccordingToButtons)

  pushButtons
    .getButton('replicate-auto')
    .on('change', changeSpanEditorAccordingToButtons)

  return {
    onText(data) {
      if (selectEndOnTextImpl) selectEndOnTextImpl(annotationData, data)
    },
    onSpan(data) {
      if (selectEndOnSpanImpl) selectEndOnSpanImpl(annotationData, data)
    }
  }
}

function selectEndOnText(spanEditor, annotationData, data) {
  const isValid = selectionValidator.validateOnText(
    annotationData,
    data.spanConfig,
    data.selection
  )

  if (isValid) {
    // The parent of the focusNode is the paragraph.
    // Same paragraph check is done in the validateOnText.
    if (
      data.selection.anchorNode.parentNode.classList.contains(
        'textae-editor__body__text-box__paragraph'
      )
    ) {
      spanEditor.create(data)
    } else if (
      data.selection.anchorNode.parentNode.classList.contains(
        'textae-editor__span'
      )
    ) {
      spanEditor.expand(data)
    }
  }

  clearTextSelection()
}

function selectEndOnSpan(spanEditor, annotationData, data) {
  const isValid = selectionValidator.validateOnSpan(
    annotationData,
    data.spanConfig,
    data.selection
  )

  if (isValid) {
    if (data.selection.anchorNode === data.selection.focusNode) {
      const ap = selectPosition.getAnchorPosition(
        annotationData,
        data.selection
      )
      const span = annotationData.span.get(
        data.selection.anchorNode.parentElement.id
      )
      if (ap === span.begin || ap === span.end) {
        spanEditor.shrinkPullByTheEar(
          data,
          data.selection.anchorNode.parentElement.id
        )
      } else {
        spanEditor.create(data)
      }
    } else if (
      data.selection.focusNode.parentElement.closest(
        `#${data.selection.anchorNode.parentElement.id}`
      )
    ) {
      spanEditor.shrinkCrossTheEar(data)
    } else if (
      data.selection.anchorNode.parentElement.closest(
        `#${data.selection.focusNode.parentElement.id}`
      )
    ) {
      spanEditor.expand(data)
    }
  }

  clearTextSelection()
}
