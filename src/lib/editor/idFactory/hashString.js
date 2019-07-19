// see: https://lowrey.me/implementing-javas-string-hashcode-in-javascript/
export default function(str) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
    hash &= hash // Convert to 32bit integer
  }

  return hash
}
