import SpanEditor from './SpanEditor'
import selectEndOnText from './selectEndOnText'
import selectEndOnSpan from './selectEndOnSpan'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  pushButtons
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
      commander,
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

  editor.eventEmitter.on(
    'textae.control.button.push',
    changeSpanEditorAccordingToButtons
  )

  return {
    onText(data) {
      if (selectEndOnTextImpl) selectEndOnTextImpl(annotationData, data)
    },
    onSpan(data) {
      if (selectEndOnSpanImpl) selectEndOnSpanImpl(annotationData, data)
    }
  }
}
