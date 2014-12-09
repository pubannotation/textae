var isTextNode = function() {
    return this.nodeType === 3; //TEXT_NODE
  },
  getFirstTextNode = function($element) {
    return $element.contents().filter(isTextNode).get(0);
  };

module.exports = getFirstTextNode;
