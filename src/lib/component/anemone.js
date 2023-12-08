import escape from 'lodash.escape'

// Escape template literals.
// For example:
//  anemone`<div>${'&'}</div>` === '<div>&amp;</div>'
//
// If you insert a function, function is called and the result is not escaped.
// For example:
//  anemone`<div>${() => '&'}</div>` === '<div>&</div>'
export default function anemone(strings) {
  const [first, ...rest] = strings

  let out = first
  for (const value of [...arguments].slice(1)) {
    out = `${out}${escapeUnlessFunction(value)}${rest.shift()}`
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
