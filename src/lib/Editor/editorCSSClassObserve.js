export default function (eventEmitter, editorCSSClass) {
  eventEmitter
    .on('textae-event.resource.startLoad', () => editorCSSClass.startWait())
    .on('textae-event.resource.endLoad', () => editorCSSClass.endWait())
    .on('textae-event.resource.startSave', () => editorCSSClass.startWait())
    .on('textae-event.resource.endSave', () => editorCSSClass.endWait())
}
