import escape from 'lodash.escape'

export default function superEscape(strings) {
  let out = strings[0]
  const values = Array.from(arguments).slice(1)

  for (let i = 0; i < values.length; i++) {
    out = `${out}${escapeUnlessFunction(values[i])}${strings[i + 1]}`
  }

  return out
}

function escapeUnlessFunction(value) {
  if (typeof value === 'function') {
    return value()
  } else {
    return escape(value)
  }
}
