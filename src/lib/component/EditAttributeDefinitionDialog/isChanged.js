export default function(orig, changed) {
  // Ignore non number value.
  return !Number.isNaN(parseFloat(changed)) && orig !== parseFloat(changed)
}
