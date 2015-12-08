module.exports = function(message) {
  // Show synchronous to smooth cancelation of selecton.
  _.defer(_.partial(
    alert,
    message
  ))
}
