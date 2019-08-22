import getElement from './getElement'

// Make the display area for text, spans, denotations, relations.
export default function($parent) {
  return getElement('div', 'textae-editor__body', $parent)
}
