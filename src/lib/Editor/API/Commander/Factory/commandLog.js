export default function (self, message, object) {
  // For debug
  if (object) {
    console.log(`[${self.constructor.name}]`, message, object)
  } else {
    console.log(`[${self.constructor.name}]`, message)
  }
}
