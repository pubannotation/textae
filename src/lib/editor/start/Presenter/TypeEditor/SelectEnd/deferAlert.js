export default function(message) {
  // Show synchronous to smooth cancelation of selecton.
  requestAnimationFrame(() => alert(message))
}
