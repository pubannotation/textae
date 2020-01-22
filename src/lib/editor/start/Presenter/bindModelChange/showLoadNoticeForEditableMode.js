import alertifyjs from 'alertifyjs'

export default function(multitrack) {
  if (multitrack) {
    alertifyjs.success(
      'track annotations have been merged to root annotations.'
    )
  }
}
