import escape from 'lodash.escape'

// Escape template literals.
// For example:
//  anemone`<div>${'&'}</div>` === '<div>&amp;</div>'
//
// If you insert a function, function is called and the result is not escaped.
// For example:
//  anemone`<div>${() => '&'}</div>` === '<div>&</div>'
export default function anemone(strings) {
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
