import escape from 'lodash.escape'

export default function escapeForDisplay(str) {
  const replaced = str.replace(/\n/g, '\\n')

  return escape(replaced)
}
