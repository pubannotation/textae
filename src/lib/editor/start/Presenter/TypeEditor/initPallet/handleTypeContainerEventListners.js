export default function handleEventListners(eventEmitter, handle, listener) {
  console.assert(eventEmitter, 'eventEmitter is neccesarry!')

  for (const event of ['type.lock', 'type.change', 'type.default.change']) {
    eventEmitter[`${handle}Listener`](event, listener)
  }
}
