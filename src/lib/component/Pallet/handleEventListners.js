export default function handleEventListners(eventEmitter, handle, listener) {
  for (const event of ['type.lock', 'type.change', 'type.default.change']) {
    eventEmitter[`${handle}Listener`](event, listener)
  }
}
