var getPosition = function(paragraph, span, node) {
    var $parent = $(node).parent()
    var parentId = $parent.attr("id")

    var pos
    if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
      pos = paragraph.get(parentId).begin
    } else if ($parent.hasClass("textae-editor__span")) {
      pos = span.get(parentId).begin
    } else {
      throw new Error('Can not get position of a node : ' + node + ' ' + node.data)
    }

    var childNodes = node.parentElement.childNodes
    for (var i = 0; childNodes[i] !== node; i++) { // until the focus node
      pos += childNodes[i].nodeName === "#text" ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length
    }

    return pos
  },
  getFocusPosition = function(annotationData, selection) {
    var pos = getPosition(annotationData.paragraph, annotationData.span, selection.focusNode)
    pos += selection.focusOffset
    return pos
  },
  getAnchorPosition = function(annotationData, selection) {
    var pos = getPosition(annotationData.paragraph, annotationData.span, selection.anchorNode)
    return pos + selection.anchorOffset
  },
  toPositions = function(annotationData, selection) {
    var anchorPosition = getAnchorPosition(annotationData, selection),
      focusPosition = getFocusPosition(annotationData, selection)

    // switch the position when the selection is made from right to left
    if (anchorPosition > focusPosition) {
      var tmpPos = anchorPosition
      anchorPosition = focusPosition
      focusPosition = tmpPos
    }

    return {
      anchorPosition: anchorPosition,
      focusPosition: focusPosition
    }
  }

module.exports = {
  toPositions: toPositions,
  getAnchorPosition: getAnchorPosition,
  getFocusPosition: getFocusPosition,
}
