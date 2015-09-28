export default function(rejects) {
  return rejects.reduce(
      (result, reject) => result || reject.hasError,
      false
  )
}
