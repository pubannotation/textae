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
  if (Array.isArray(value) && typeof value.at(0) === 'function') {
    return value.map((v) => v()).join('')
  }

  if (typeof value === 'function') {
    const result = value()

    if (Array.isArray(result)) {
      return result.join('')
    }

    return result
  }

  return escape(value)
}
