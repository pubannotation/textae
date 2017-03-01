import getElement from './getElement'
import _ from 'underscore'

// Make the display area for text, spans, denotations, relations.
export default _.partial(getElement, 'div', 'textae-editor__body')
