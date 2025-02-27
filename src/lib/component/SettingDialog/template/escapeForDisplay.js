import escape from 'lodash.escape'

export default function escapeForDisplay(str) {
  const replaced = str.replace(/\n/g, '\\n').replace(/\t/g, '\\t')

  return escape(replaced)
}
