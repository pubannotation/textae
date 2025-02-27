export default function decodeEscapeSequences(str) {
  return str.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}
