export default function($dialog, dataSourceUrl, parameter) {
  // If has the save_to parameter
  let url = dataSourceUrl
  if (parameter.has('save_to')) {
    url = parameter.get('save_to')
  }

  // Display dataSourceUrl.
  $dialog
    .find('[type="text"].url')
    .val(url)
    .trigger('input')

  $dialog.open()

  return $dialog
}
