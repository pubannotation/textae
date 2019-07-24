export default function($dialog, params, dataSourceUrl, parameter) {
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

  $dialog
    .find('[type="text"].url--config')
    .val(url)
    .trigger('input')

  $dialog.params = params
  $dialog.open()

  return $dialog
}
