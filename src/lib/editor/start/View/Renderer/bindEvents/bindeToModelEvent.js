export default function(emitter, annotationData, eventName, handler) {
  annotationData.on(eventName, param => {
    handler(param)
    emitter.emit(eventName)
  })
}
