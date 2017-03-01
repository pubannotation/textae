// global.jQuery = require("jquery");
// jsPlumb = require("js-plumb");
// require("jsplumb");

export default function(container) {
  const newInstance = jsPlumb.getInstance({
    ConnectionsDetachable: false,
    Endpoint: ['Dot', {
      radius: 1
    }]
  })
  newInstance.setRenderMode(newInstance.SVG)
  newInstance.Defaults.Container = container
  return newInstance
}
