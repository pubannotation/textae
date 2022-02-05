export default function (message, object) {
  // For debug
  if (object) {
    console.log('[command.invoke]', message, object)
  } else {
    console.log('[command.invoke]', message)
  }
}
