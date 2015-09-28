export default function(tagName, className, $parent) {
  var $area = $parent.find('.' + className)
  if ($area.length === 0) {
    $area = $('<' + tagName + '>').addClass(className)
    $parent.append($area)
  }
  return $area
}
