import toastr from 'toastr'

export default function(multitrack) {
  if (multitrack) {
    toastr.success('track annotations have been merged to root annotations.')
  }
}
