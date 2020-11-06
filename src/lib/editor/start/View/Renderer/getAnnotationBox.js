import $ from 'jquery'

// Get the display area for denotations and relations.
export default function (editor) {
  return $(editor[0].querySelector('.textae-editor__body__annotation-box'))
}
