import escape from 'lodash.escape'

export default function escapeForDisplay(str) {
  const replaced = str
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')

  return escape(replaced)
}
