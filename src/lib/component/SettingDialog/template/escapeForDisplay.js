import escape from 'lodash.escape'
import EscapeSequence from '../EscapeSequence'

export default function escapeForDisplay(str) {
  // First, escape newline, tab, and carriage returns to display them.
  const replaced = EscapeSequence.escape(str)

  // Then, escape special HTML characters to ensure safe rendering in HTML.
  return escape(replaced)
}
