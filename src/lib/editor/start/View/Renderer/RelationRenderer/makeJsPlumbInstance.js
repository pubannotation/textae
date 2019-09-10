export default function(container) {
  return jsPlumb.getInstance({
    ConnectionsDetachable: false,
    Container: container,
    Endpoint: [
      'Dot',
      {
        radius: 1
      }
    ]
  })
}
