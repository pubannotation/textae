import * as selectionValidator from './selectionValidator'
import SpanEditor from './SpanEditor'

module.exports = function(editor, model, command, modeAccordingToButton, typeContainer) {
  // Initiated by events.
  var selectEndOnTextImpl = null,
    selectEndOnSpanImpl = null,
    changeSpanEditorAccordingToButtons = function() {
      var isDetectDelimiterEnable = modeAccordingToButton['boundary-detection'].value(),
        isReplicateAuto = modeAccordingToButton['replicate-auto'].value(),
        spanEditor = new SpanEditor(editor, model, command, typeContainer, isDetectDelimiterEnable, isReplicateAuto)

      selectEndOnTextImpl = (annotationData, data) => selectEndOnText(spanEditor, annotationData, data)
      selectEndOnSpanImpl = (annotationData, data) => selectEndOnSpan(spanEditor, annotationData, data)
    }

  // Change spanEditor according to the  buttons state.
  changeSpanEditorAccordingToButtons()

  modeAccordingToButton['boundary-detection']
    .on('change', changeSpanEditorAccordingToButtons)

  modeAccordingToButton['replicate-auto']
    .on('change', changeSpanEditorAccordingToButtons)

  return {
    onText: function(data) {
      if (selectEndOnTextImpl) selectEndOnTextImpl(model.annotationData, data)
    },
    onSpan: function(data) {
      if (selectEndOnSpanImpl) selectEndOnSpanImpl(model.annotationData, data)
    }
  }
}

function selectEndOnText(spanEditor, annotationData, data) {
  var isValid = selectionValidator.validateOnText(annotationData, data.spanConfig, data.selection)

  if (isValid) {
    // The parent of the focusNode is the paragraph.
    // Same paragraph check is done in the validateOnText.
    if (data.selection.anchorNode.parentNode.classList.contains('textae-editor__body__text-box__paragraph')) {
      spanEditor.create(data)
    } else if (data.selection.anchorNode.parentNode.classList.contains('textae-editor__span')) {
      spanEditor.expand(data)
    }
  }
}

function selectEndOnSpan(spanEditor, annotationData, data) {
  var isValid = selectionValidator.validateOnSpan(annotationData, data.spanConfig, data.selection)

  if (isValid) {
    if (data.selection.anchorNode === data.selection.focusNode) {
      spanEditor.create(data)
    } else if (data.selection.focusNode.parentElement.closest(`#${data.selection.anchorNode.parentElement.id}`)) {
      spanEditor.shrink(data)
    } else if (data.selection.anchorNode.parentElement.closest(`#${data.selection.focusNode.parentElement.id}`)) {
      spanEditor.expand(data)
    }
  }
}
