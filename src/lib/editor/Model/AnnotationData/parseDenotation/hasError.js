export default function(rejects) {
  return rejects.some((r) => r.hasError)
}
